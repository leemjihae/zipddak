package com.zipddak.admin.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.BrandDto;
import com.zipddak.admin.dto.EstimatePaymentCostDto;
import com.zipddak.admin.dto.EstimatePaymentStep1Dto;
import com.zipddak.admin.dto.PaymentComplateDto;
import com.zipddak.admin.dto.PaymentInfoDto;
import com.zipddak.admin.dto.RecvUserDto;
import com.zipddak.admin.dto.productPaymentStep1Dto;
import com.zipddak.admin.service.EstimateDetailService;
import com.zipddak.admin.service.MatchingService;
import com.zipddak.admin.service.OrderService;
import com.zipddak.admin.service.PaymentService;
import com.zipddak.admin.service.UserAddressService;
import com.zipddak.entity.Rental;
import com.zipddak.user.dto.RentalPaymentStep1Dto;
import com.zipddak.user.service.RentalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user/payment")
@RequiredArgsConstructor
public class PaymentController {
	
	private final PaymentService paymentService;
	private final OrderService paymentOrderService;
	private final EstimateDetailService estimateDetailService;
	private final MatchingService matchingService;
	private final RentalService rentalService;
	private final UserAddressService userService;

	
	@Value("${react-server.uri}")
	private String reactServer;
	// 처음 결제를 요청할때 orderId를 생성하고
	// DB에서 금액을 다시 계산해서 amoun를 반환한다. -> front에서 가격을 조작할 수 있음
	// orderName은 알아서 작성
	
	@PostMapping("/product")
	public ResponseEntity<PaymentInfoDto> productPayment(@RequestBody productPaymentStep1Dto paymentDto){
		
		try {
			
			// 기본 배송지로 저장을 체크한 경우
			if(paymentDto.getRecvUser().isDefaultAddress()) {
				userService.saveAddress(paymentDto.getRecvUser(), paymentDto.getUsername());
			}
			
			// orderId 생성
			String orderId = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
	                + "-" + (int)(Math.random() * 9000 + 1000);
			
			List<BrandDto> brandList = paymentDto.getBrandList();
			
			// 총 결제 가격 계산
			Map<String, Long> amount = paymentService.getTotalPrice(brandList);
			
			// 상품 이름 + 옵션 개수 string 생성
			String orderName = paymentService.getOrderName(brandList);
			
			// 주문 테이블 + 주문 상품 테이블에 저장
			RecvUserDto recvUser = paymentDto.getRecvUser();
			recvUser.setTel("010"+recvUser.getTel());
			String username = paymentDto.getUsername();
			paymentOrderService.addOrder(username, orderId, amount, recvUser, brandList);
			
			
			PaymentInfoDto paymentInfo = PaymentInfoDto.builder()
				.orderId(orderId)
				.amount(((Long) amount.get("totalPrice")).intValue())
				.orderName(orderName)
				.build();
			
			return ResponseEntity.ok(paymentInfo);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("/estimate")
	public ResponseEntity<PaymentInfoDto> estimatePayment(@RequestBody EstimatePaymentStep1Dto paymentDto){
		
		try {
			
			// orderId 생성
			String orderId = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
	                + "-" + (int)(Math.random() * 9000 + 1000);
			
			// 총 결제 가격 계산
			EstimatePaymentCostDto costDto = estimateDetailService.detail(paymentDto.getEstimateIdx());
			
			Integer amount = 0;
			
			// 컨설팅 이라면
			if(costDto.getLargeServiceIdx() == 74) {
				amount += costDto.getConsultingLaborCost()
						+ costDto.getStylingDesignCost()
						+ costDto.getThreeDImageCost()
						+ costDto.getReportProductionCost()
						+ costDto.getEtcFee();
			}else {
				amount += costDto.getBuildCostSum()
						+costDto.getMaterialCostSum()
						+costDto.getDisposalCost()
						+costDto.getDemolitionCost()
						+costDto.getEtcFee();
						
			}
			
			// 상품 이름 + 옵션 개수 string 생성
			
			String orderName;
			if(costDto.getLargeServiceIdx() == 74) {
				orderName = "시공견적 컨설팅 비용";
			}else if(costDto.getLargeServiceIdx() == 23) {
				orderName = "수리 견적비용";
			}else {
				orderName = "인테리어 견적비용";
			}
				
			// 매칭 테이블 저장
			matchingService.createMatching(paymentDto, orderId);
			
			PaymentInfoDto paymentInfo = PaymentInfoDto.builder()
				.orderId(orderId)
				.amount(amount)
				.orderName(orderName)
				.build();
			
			return ResponseEntity.ok(paymentInfo);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	
	
	// 서버에서 토스 최종 결제를 승인해야함
	@GetMapping("/complete")
	public ResponseEntity<?> paymentComplate(PaymentComplateDto paymentComplateDto){
		
		try {
			
			
			paymentService.approvePayment(paymentComplateDto, "product");
			
			 // 클라이언트로 리다이렉트할 때 주문 ID 포함
		    String redirectUrl = reactServer + "zipddak/productOrderComplete?orderCode=" + paymentComplateDto.getOrderId();
			
			return ResponseEntity.status(HttpStatus.FOUND)
					.location(URI.create(redirectUrl))
					.build();
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 서버에서 토스 최종 결제를 승인해야함
	@GetMapping("/estimate/complete")
	public ResponseEntity<?> paymentEstimateComplate(PaymentComplateDto paymentComplateDto){
		
		try {
			
			paymentService.approvePayment(paymentComplateDto, "estimate");
			
		    String redirectUrl = reactServer + "zipddak/mypage/expert/works";
			
			return ResponseEntity.status(HttpStatus.FOUND)
					.location(URI.create(redirectUrl))
					.build();
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	
	//공구대여 결제
	@PostMapping("/rental")
	public ResponseEntity<PaymentInfoDto> RentalPayment(@RequestBody RentalPaymentStep1Dto paymentDto){
		
		try {
			
			// orderId 생성
			String orderId = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
	                + "-" + (int)(Math.random() * 9000 + 1000);
			
			String toolIdxStr = paymentDto.getToolIdx().toString();
			
			// 주문 테이블 + 주문 상품 테이블에 저장
			String orderName = "Rental"+toolIdxStr;
			
//			RecvUserDto recvUser = paymentDto.getRecvUser();
			String username = paymentDto.getUsername();
			Integer amount = paymentDto.getAmount();
//			paymentOrderService.addRentalOrder(username, orderId, amount, recvUser);
			rentalService.rentalApplication(paymentDto.getRental(), orderId);
			
			PaymentInfoDto paymentInfo = PaymentInfoDto.builder()
				.orderId(orderId)
				.amount(amount)
				.orderName(orderName)
				.build();
			
			return ResponseEntity.ok(paymentInfo);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	
	// 서버에서 토스 최종 결제를 승인해야함
		@GetMapping("/rental/complete")
		public ResponseEntity<?> paymentRentalComplate(PaymentComplateDto paymentComplateDto){
			
			try {
				
				paymentService.approvePayment(paymentComplateDto, "rental");
				Integer toolIdx = paymentComplateDto.getToolIdx();
				String orderId = paymentComplateDto.getOrderId();
				
			    String redirectUrl = reactServer + "zipddak/mypage/tools/rentals";
				
				return ResponseEntity.status(HttpStatus.FOUND)
						.location(URI.create(redirectUrl))
						.build();
			}catch(Exception e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(null);
			}
			
		}
	
}
