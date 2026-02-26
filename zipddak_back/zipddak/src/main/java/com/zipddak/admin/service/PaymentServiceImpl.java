package com.zipddak.admin.service;

import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.admin.dto.BrandDto;
import com.zipddak.admin.dto.OptionListDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.PaymentComplateDto;
import com.zipddak.admin.repository.ProductDslRepository;
import com.zipddak.entity.Expert;
import com.zipddak.entity.Matching;
import com.zipddak.entity.Order;
import com.zipddak.entity.Payment;
import com.zipddak.entity.Matching.MatchingStatus;
import com.zipddak.entity.Order.PaymentStatus;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.entity.Product.PostType;
import com.zipddak.entity.Rental.RentalStatus;
import com.zipddak.entity.Request;
import com.zipddak.entity.Rental;
import com.zipddak.entity.User;
import com.zipddak.entity.OrderItem;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.MatchingRepository;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.repository.OrderRepository;
import com.zipddak.repository.PaymentRepository;
import com.zipddak.repository.RentalRepository;
import com.zipddak.repository.RequestRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private final ProductDslRepository productDslRepository;
	
	private final PaymentRepository paymentRepository;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final MatchingRepository matchingRepository;
	private final ExpertRepository expertRepository;
	private final UserRepository userRepository;
	private final RentalRepository rentalRepository;
	private final RequestRepository requestRepository;
	
	@Value("${toss-payment-secret-key}")
	private String tossSecretKey;

	// 결제 금액 계산
	@Override
	public Map<String, Long> getTotalPrice(List<BrandDto> brandList) {

		long productTotal = 0;   // 상품 전체 금액
	    long postChargeTotal = 0; // 배송비 합계

	    for (BrandDto brand : brandList) {
	        List<OptionListDto> orderList = brand.getOrderList();
	        System.out.println("orderList : " + orderList);
	        if (orderList == null || orderList.isEmpty()) continue;
	        
	        // 1. 상품 금액 합계
	        long brandProductTotal = orderList.stream()
	                .mapToLong(o -> {
	                    return o.getPrice() * o.getCount();
	                })
	                .sum();

	        productTotal += brandProductTotal;
	        
	       


	        // 2. 배송비 합계
	        // single 배송비
	        long singlePost = orderList.stream()
	                .filter(o -> o.getPostType() == PostType.single)
	                .mapToLong(o -> o.getPostCharge() * o.getCount())
	                .sum();


	        // bundle 배송비
	        long bundleTotalPrice = orderList.stream()
	                .filter(o -> o.getPostType() == PostType.bundle)
	                .mapToLong(o -> brand.getBasicPostCharge() * o.getCount())
	                .sum();

	        boolean hasBundle = orderList.stream()
	                .anyMatch(o -> o.getPostType() == PostType.bundle);
	        
	        long bundlePost = 0;

	        if (hasBundle) {
	            bundlePost = bundleTotalPrice >= brand.getFreeChargeAmount()
	                    ? 0
	                    : brand.getBasicPostCharge();
	        }
	        
	        postChargeTotal += (singlePost + bundlePost);  
	        
	    }

	    long totalPrice = productTotal + postChargeTotal;
	    
	    Map<String, Long> amount = new HashMap<String, Long>();
	    amount.put("productTotal", productTotal);
	    amount.put("postChargeTotal", postChargeTotal);
	    amount.put("totalPrice", totalPrice);
	    
	    return amount;
	    
	}

	
	// orderName 생성
	@Override
	public String getOrderName(List<BrandDto> brandList) {
		
		OptionListDto option = brandList.get(0).getOrderList().get(0);
		
		int totalSize = brandList.stream()
		        .mapToInt(brand -> brand.getOrderList() != null ? brand.getOrderList().size() : 0)
		        .sum();

		
		String name = option.getProductName() + "외 " + (totalSize - 1) + "개의 상품"; 
		
		return name;
		
	}


	// 결제 최종 승인
	@Override
	@Transactional
	public void approvePayment(PaymentComplateDto paymentComplateDto, String type) throws Exception {
		
		// Toss 결제 승인 api url
		String url = "https://api.tosspayments.com/v1/payments/" + paymentComplateDto.getPaymentKey();
		
		// 헤더 설정 -> 시크릿 키
		HttpHeaders headers = new HttpHeaders();
		headers.setBasicAuth(tossSecretKey, "");
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		// body
		Map<String, Object> body = new HashMap<String, Object>();
		body.put("orderId", paymentComplateDto.getOrderId());
		body.put("amount", paymentComplateDto.getAmount());
		
		HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
		
		// 결제 승인 요청
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters()
	    .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
		ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
		
		// response에 가져온 데이터를 꺼내야함
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = objectMapper.readTree(response.getBody());
		
		// 만약에 결제가 성공 된다면 추가할 데이터
		
		if(response.getStatusCode() == HttpStatus.OK) {
			
			OffsetDateTime requestedAtOdt = OffsetDateTime.parse(jsonNode.path("requestedAt").asText());
			OffsetDateTime approvedAtOdt = OffsetDateTime.parse(jsonNode.path("approvedAt").asText());

			// Timestamp로 변환
			Timestamp requestedAt = Timestamp.from(requestedAtOdt.toInstant());
			Timestamp approvedAt = Timestamp.from(approvedAtOdt.toInstant());
			
			PaymentType paymentType = null;
			
			if(type.equals("product")) {
				paymentType = PaymentType.ORDER;
			}else if(type.equals("estimate")) {
				paymentType = PaymentType.MATCHING;
			}else if(type.equals("rental")) {
				paymentType = PaymentType.RENTAL;
			}
			
			// 결제 데이터 (결제 테이블)
			Payment payment = Payment.builder()
									.paymentKey(jsonNode.path("paymentKey").asText())
									.type(jsonNode.path("type").asText())
									.orderId(jsonNode.path("orderId").asText())
									.orderName(jsonNode.path("orderName").asText())
									.mId(jsonNode.path("mId").asText())
									.method(jsonNode.path("method").asText())
									.totalAmount(jsonNode.path("totalAmount").asInt())
									.balanceAmount(jsonNode.path("balanceAmount").asInt())
									.status(jsonNode.path("status").asText())
									.requestedAt(requestedAt)
									.approvedAt(approvedAt)
									.lastTransactionKey(jsonNode.path("lastTransactionKey").asText())
									.isPartialCancelable(jsonNode.path("isPartialCancelable").asBoolean())
									.receiptUrl(jsonNode.path("receipt").path("url").asText())
									.cardAmount(jsonNode.path("card").path("amount").asInt())
									.cardIssuerCode(jsonNode.path("card").path("issuerCode").asText())
									.cardAcquirerCode(jsonNode.path("card").path("acquirerCode").asText())
									.cardNumber(jsonNode.path("card").path("number").asText())
									.cardInstallmentPlanMonths(jsonNode.path("card").path("installmentPlanMonths").asInt())
									.easypayProvider(jsonNode.path("easyPay").path("provider").asText())
									.easypayAmount(jsonNode.path("easyPay").path("amount").asInt())
									.username(paymentComplateDto.getUsername())
									.paymentType(paymentType)
									.build();
			
			
			if(paymentComplateDto.getExpertIdx() != null) {
//				payment.set
				Expert expert = expertRepository.findById(paymentComplateDto.getExpertIdx()).orElseThrow(() -> new Exception("전문가 아이디 조회 오류"));
				User user = userRepository.findById(expert.getUser().getUsername()).orElseThrow(() -> new Exception("전문가 정보로 사용자 아이디 조회 오류"));
				
				payment.setSellUsername(user.getUsername());
				
				if(type.equals("product")) {
					payment.setSellUserType("SELLER");
				}else if(type.equals("estimate")) {
					payment.setSellUserType("EXPERT");
				}
			}
			
			Payment savedPayment = paymentRepository.save(payment);
			
			
			if(type.equals("product")) {
				
				// 주문 데이터에서 결제 완료로 업데이트 그리고 payment_idx도 넣어야함
				
				Order order = orderRepository.findByOrderCode(jsonNode.path("orderId").asText());
				order.setPaymentStatus(PaymentStatus.결제완료);
				order.setPaymentIdx(savedPayment.getPaymentIdx());
				
				orderRepository.save(order);
				
				// 각 상품에 대한 주문 상품 정보에서 주문 상태를 상품 준비중으로 업데이트
				List<OrderItem> orderItems = orderItemRepository.findByOrderIdx(order.getOrderIdx());
				
				for(OrderItem orderItem : orderItems) {
					orderItem.setOrderStatus(OrderStatus.상품준비중);
					orderItemRepository.save(orderItem);
					
				}
				
			}else if(type.equals("estimate")) {
				
				// 매칭 데이터에서 결제 완료로 업데이트 그리고 payment_idx도 넣어야함
				
				Matching matching = matchingRepository.findByMatchingCode(jsonNode.path("orderId").asText());
				
				matching.setStatus(MatchingStatus.PAYMENT_COMPLETED);
				matching.setPaymentIdx(savedPayment.getPaymentIdx());
				
				matchingRepository.save(matching);
				
				// 요청서 데이터에서 요청 상태를 업데이트 해야함
				
				Request req = requestRepository.findById(matching.getRequestIdx()).orElseThrow(() -> new Exception("매칭에 관련된 요청서 조회 중 에러"));
				
				req.setStatus("RECRUITED");
				
				requestRepository.save(req);
				
			}else if(type.equals("rental")) {
				
				Rental rental = rentalRepository.findByRentalCode(jsonNode.path("orderId").asText());
				
				rental.setSatus(RentalStatus.PAYED);
				
				rentalRepository.save(rental);
				
			}
			
		}
		
	}

}
