package com.zipddak.mypage.service;

import java.io.File;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.OrderDto;
import com.zipddak.dto.ProductOptionDto;
import com.zipddak.entity.ClaimFile;
import com.zipddak.entity.Exchange;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.entity.ProductOption;
import com.zipddak.entity.Refund;
import com.zipddak.mypage.dto.ExchangeRequestDto;
import com.zipddak.mypage.dto.ExchangeRequestDto.ExchangeItemDto;
import com.zipddak.mypage.dto.ReturnRequestDto;
import com.zipddak.repository.ClaimFileRepository;
import com.zipddak.repository.ExchangeRepository;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.repository.OrderRepository;
import com.zipddak.repository.ProductOptionRepository;
import com.zipddak.repository.RefundRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderClaimServiceImpl implements OrderClaimService {

	private final OrderItemRepository orderItemRepository;
	private final OrderRepository orderRepository;
	private final ProductOptionRepository productOptionRepository;
	private final RefundRepository refundRepository;
	private final ExchangeRepository exchangeRepository;
	private final ClaimFileRepository claimFileRepository;
	
	@Value("${claimFile.path}")
	private String uploadDir;

	// 취소
	@Override
	public void cancelOrderItem(List<Integer> orderItemIdxs) throws Exception {
		for (Integer orderItemIdx : orderItemIdxs) {
			OrderItem orderItem = orderItemRepository.findById(orderItemIdx)
					.orElseThrow(() -> new RuntimeException("잘못된 주문상품 아이디"));

			if (orderItem.getOrderStatus() == OrderStatus.상품준비중)
				orderItem.setOrderStatus(OrderStatus.취소완료);

			orderItemRepository.save(orderItem);
		}
	}

	// 주문 조회
	@Override
	public OrderDto getOrderInfo(Integer orderIdx) throws Exception {
		return orderRepository.findById(orderIdx).orElseThrow(() -> new RuntimeException("잘못된 주문 아이디")).toDto();
	}

	// 반품
	@Override
	public void returnOrderItem(ReturnRequestDto returnRequest, MultipartFile[] returnImages) throws Exception {
		// 1. 파일 저장 & ClaimFile 테이블에 insert
		Integer[] claimFileIdxArr = new Integer[3];

		if (returnImages != null) {
			for (int i = 0; i < returnImages.length; i++) {
				MultipartFile file = returnImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(uploadDir);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(uploadDir + "/" + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ClaimFile claimFile = ClaimFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(uploadDir + rename).build();

				ClaimFile savedFile = claimFileRepository.save(claimFile);

				// 1-6. refund 테이블 image1_idx ~ image3_idx 용 FK 설정
				claimFileIdxArr[i] = savedFile.getClaimFileIdx();
			}
		}

		// 2. refund 테이블 insert
		Refund refund = Refund.builder().orderIdx(returnRequest.getOrderIdx()).reasonType(returnRequest.getReasonType())
				.reasonDetail(returnRequest.getReasonDetail()).image1Idx(claimFileIdxArr[0])
				.image2Idx(claimFileIdxArr[1]).image3Idx(claimFileIdxArr[2])
				.shippingChargeType(returnRequest.getShippingChargeType())
				.returnShippingFee(returnRequest.getReturnShippingFee()).refundAmount(returnRequest.getRefundAmount())
				.build();

		Refund saveRefund = refundRepository.save(refund);

		// 3. 반품 요청된 orderItem 상태 변경
		for (Integer itemIdx : returnRequest.getReturnItemIdxs()) {

			OrderItem orderItem = orderItemRepository.findById(itemIdx)
					.orElseThrow(() -> new RuntimeException("잘못된 주문상품 아이디"));

			orderItem.setRefundIdx(saveRefund.getRefundIdx());
			orderItem.setOrderStatus(OrderStatus.반품요청);

			orderItemRepository.save(orderItem);
		}
	}

	// 상품옵션 목록 조회
	@Override
	public List<ProductOptionDto> getProductOptionList(Integer productIdx) throws Exception {
		return productOptionRepository.findByProduct_ProductIdx(productIdx).stream().map(ProductOption::toDto)
				.collect(Collectors.toList());
	}

	// 교환
	@Override
	public void exchangeOrderItem(ExchangeRequestDto exchangeRequest, MultipartFile[] exchangeImages) throws Exception {
		// 1. 파일 저장 & ClaimFile 테이블에 insert
		Integer[] claimFileIdxArr = new Integer[3];

		if (exchangeImages != null) {
			for (int i = 0; i < exchangeImages.length; i++) {
				MultipartFile file = exchangeImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(uploadDir);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(uploadDir + "/" + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ClaimFile claimFile = ClaimFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(uploadDir + rename).build();

				ClaimFile savedFile = claimFileRepository.save(claimFile);

				// 1-6. exchange 테이블 image1_idx ~ image3_idx 용 FK 설정
				claimFileIdxArr[i] = savedFile.getClaimFileIdx();
			}
		}

		// 2. exchange 테이블 insert
		Exchange exchange = Exchange.builder().orderIdx(exchangeRequest.getOrderIdx())
				.reasonType(exchangeRequest.getReasonType()).reasonDetail(exchangeRequest.getReasonDetail())
				.image1Idx(claimFileIdxArr[0]).image2Idx(claimFileIdxArr[1]).image3Idx(claimFileIdxArr[2])
				.shippingChargeType(exchangeRequest.getShippingChargeType())
				.roundShippingFee(exchangeRequest.getRoundShippingFee()).reshipName(exchangeRequest.getReshipName())
				.reshipPhone(exchangeRequest.getReshipPhone()).reshipZipcode(exchangeRequest.getReshipZipcode())
				.reshipAddr1(exchangeRequest.getReshipAddr1()).reshipAddr2(exchangeRequest.getReshipAddr2())
				.reshipPostMemo(exchangeRequest.getReshipPostMemo()).build();

		Exchange saveExchange = exchangeRepository.save(exchange);

		// 3. 교환 요청된 orderItem 상태 변경, 교환옵션 추가
		for (ExchangeItemDto exchangeItem : exchangeRequest.getExchangeItems()) {

			OrderItem orderItem = orderItemRepository.findById(exchangeItem.getOrderItemIdx())
					.orElseThrow(() -> new RuntimeException("잘못된 주문상품 아이디"));

			orderItem.setExchangeIdx(saveExchange.getExchangeIdx());
			orderItem.setOrderStatus(OrderStatus.교환요청);
			orderItem.setExchangeIdx(exchangeItem.getNewOptionIdx());

			orderItemRepository.save(orderItem);
		}
	}

}
