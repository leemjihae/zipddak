package com.zipddak.seller.service;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.admin.dto.PaymentComplateDto;
import com.zipddak.admin.service.PaymentService;
import com.zipddak.entity.Exchange;
import com.zipddak.entity.Expert;
import com.zipddak.entity.Matching;
import com.zipddak.entity.Order;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.Payment;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.entity.Rental.RentalStatus;
import com.zipddak.entity.Refund;
import com.zipddak.entity.Refund.RefundShippingChargeType;
import com.zipddak.entity.Rental;
import com.zipddak.entity.User;
import com.zipddak.entity.Matching.MatchingStatus;
import com.zipddak.entity.Order.PaymentStatus;
import com.zipddak.enums.TrackingRegistType;
import com.zipddak.repository.ExchangeRepository;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.repository.OrderRepository;
import com.zipddak.repository.PaymentRepository;
import com.zipddak.repository.RefundRepository;
import com.zipddak.seller.dto.CompletedResponseDto;
import com.zipddak.seller.dto.OrderItemActionRequestDto;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.repository.SellerRefundRepository;
import com.zipddak.util.RefundAmountCalculator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ModalActionServiceImpl implements ModalActionService {
	
	private final RefundRepository refund_repo;
	private final ExchangeRepository exchange_repo;
	private final OrderRepository order_repo;
	private final OrderItemRepository orderItem_repo;
	private final PaymentRepository payment_repo;
	private final SellerRefundRepository sellerRefund_repo;
	
	private final PaymentService paymentService;
	
	@Value("${toss-payment-secret-key}")
	private String tossSecretKey;
	
	//운송장 등록
	@Override
	@Transactional
	public SaveResultDto registerTrackingNo(OrderItemActionRequestDto reqItems) {
		// 해당 주문의 해당 itemIdx 목록만 조회
	    List<OrderItem> orderitems = orderItem_repo.findOrderItemsByOrderIdxAndOrderItemIdxIn(reqItems.getOrderIdx(), reqItems.getItemIdxs());

        if (orderitems.isEmpty()) {
            throw new IllegalArgumentException("운송장을 등록할 상품이 없습니다.");
        }
        
        TrackingRegistType type = reqItems.getRegistType();
        
        //각 orderItem에 운송장 등록 
        switch (type) {
	        case FIRST_SEND:
	            registFirstSend(orderitems, reqItems);
	            break;
	
	        case REFUND_PICKUP:
	            registReturnPickup(orderitems, reqItems);
	            break;
	
	        case EXCHANGE_PICKUP:
	            registExchangePickup(orderitems, reqItems);
	            break;
	
	        case EXCHANGE_SEND:
	            registExchangeSend(orderitems, reqItems);
	            break;
	
	        default:
	            throw new IllegalArgumentException("알 수 없는 운송장 등록 타입");
	    }
        
        return new SaveResultDto(true, null, "운송장 등록이 완료되었습니다.");
	}
	
	//최초발송 운송장등록 
	private void registFirstSend(List<OrderItem> items, OrderItemActionRequestDto req) {

	    for (OrderItem item : items) {

	        if (item.getOrderStatus() != OrderStatus.상품준비중) {
	            throw new IllegalStateException("상품준비중 상태에서만 최초 발송 가능: " + item.getOrderItemIdx());
	        }

	        item.setPostComp(req.getPostComp());
	        item.setTrackingNo(req.getTrackingNumber());
	        item.setFirstShipDate(LocalDateTime.now());
	        item.setOrderStatus(OrderStatus.배송중);

	        orderItem_repo.save(item);
	    }
	}
	//반품수거 운송장등록 
	private void registReturnPickup(List<OrderItem> items, OrderItemActionRequestDto req) {

	    Refund refund = refund_repo.findById(items.get(0).getRefundIdx()).orElseThrow(() -> new IllegalStateException("반품 정보 없음"));

	    if (refund.getPickupTrackingNo() != null) {
	        throw new IllegalStateException("이미 반품 수거 운송장이 등록됨");
	    }

	    refund.setPickupPostComp(req.getPostComp());
	    refund.setPickupTrackingNo(req.getTrackingNumber());

	    refund_repo.save(refund);
	}
	//교환 수거 운송장 등록 
	private void registExchangePickup(List<OrderItem> items, OrderItemActionRequestDto req) {

	    Exchange exchange = exchange_repo.findById(items.get(0).getExchangeIdx()).orElseThrow(() -> new IllegalStateException("교환 정보 없음"));

	    if (exchange.getPickupTrackingNo() != null) {
	        throw new IllegalStateException("이미 교환 수거 운송장 등록됨");
	    }

	    exchange.setPickupPostComp(req.getPostComp());
	    exchange.setPickupTrackingNo(req.getTrackingNumber());

	    exchange_repo.save(exchange);
	}
	//교환재발송 
	private void registExchangeSend(List<OrderItem> items, OrderItemActionRequestDto req) {

	    Exchange exchange = exchange_repo.findById(items.get(0).getExchangeIdx()).orElseThrow(() -> new IllegalStateException("교환 정보 없음"));

	    if (exchange.getReshipTrackingNo() != null) {
	        throw new IllegalStateException("이미 교환 재발송 운송장이 등록됨");
	    }

	    // 1. Exchange에 운송장 등록
	    exchange.setReshipPostComp(req.getPostComp());
	    exchange.setReshipTrackingNo(req.getTrackingNumber());
	    exchange_repo.save(exchange);

	    // 2. 관련 OrderItem에 재발송 일자 기록
	    for (OrderItem item : items) {
	        if (item.getOrderStatus() != OrderStatus.교환요청) {
	            throw new IllegalStateException("교환진행중 상태에서만 교환 재발송 가능: " + item.getOrderItemIdx());
	        }

	        item.setResendAt(LocalDateTime.now());
	        item.setOrderStatus(OrderStatus.배송중); // 재발송 후 상태
	        orderItem_repo.save(item);
	    }
	}
	
	//수거완료처리
	@Override
	@Transactional
	public CompletedResponseDto pickupComplated(OrderItemActionRequestDto req) {
		Integer refundIdx = req.getNum(); 
			if (refundIdx == null) {
				throw new IllegalArgumentException("refundIdx가 없습니다.");
			}
		// 1. refund 조회
	    Refund refund = refund_repo.findById(refundIdx).orElseThrow(() -> new IllegalArgumentException("반품 정보가 존재하지 않습니다."));

	    // 2. 해당 반품에 묶인 orderItem 조회
	    List<OrderItem> orderItems = orderItem_repo.findByRefundIdx(refundIdx);
	    if (orderItems.isEmpty()) {
	        throw new IllegalStateException("반품에 연결된 주문상품이 없습니다.");
	    }

	    // 3. orderItem 일괄 수거완료 처리
	    LocalDateTime today = LocalDateTime.now();

	    for (OrderItem item : orderItems) {
	        // 반품 수거완료일자
	        item.setRefundPickupComplatedAt(today);
	        // 주문 상태 변경
	        item.setOrderStatus(OrderStatus.반품회수);
	    }
		
		return new CompletedResponseDto(true, today);
	}
	
	//반품 거절 처리 
	@Override
	@Transactional
	public SaveResultDto refundRejectItems(OrderItemActionRequestDto reqItems) {
		// 해당 주문의 해당 itemIdx 목록만 조회
	    List<OrderItem> Orderitems = orderItem_repo.findOrderItemsByOrderIdxAndOrderItemIdxIn(reqItems.getOrderIdx(), reqItems.getItemIdxs());
	    Integer successCnt = 0;
	    
	    if (Orderitems.isEmpty()) {
			throw new IllegalArgumentException("처리할 상품이 없습니다.");
		}

		// 전체 리스트 검증 (DB 변경 X)
	    for (OrderItem item : Orderitems) {
	    	System.out.println(item.getOrderStatus());

	        // 이미 환불 또는 반품 완료 상태 체크
	        if (item.getOrderStatus().equals(OrderStatus.반품완료)) {
	        	throw new IllegalStateException("이미 반품처리된 상품은 환불 불가.");
	        }

	        // 상태 변경
	        item.setOrderStatus(OrderStatus.반품거절);
	        item.setRefundRejectedAt(LocalDateTime.now());
	        item = orderItem_repo.save(item);  //db저장
	        
	        System.out.println("itemsss : " + item);
	        
	        successCnt++;
	    }

	  //요청한 상품의 개수와 db변경된 개수가 일치할경우(모두 성공)
        if(Orderitems.size() == successCnt) {
        	 return new SaveResultDto(true,null,"요청한 상품의 반품 거절 처리가 완료되었습니다");
        	 
        }else {
        	return new SaveResultDto(false,null,"요청 처리 실패");
        }
	}
	
	
	//반품 접수 수락 처리 
	@Override
	@Transactional
	public SaveResultDto refundAcceptItems(OrderItemActionRequestDto reqItems) {
		// 해당 주문의 해당 itemIdx 목록만 조회
	    List<OrderItem> Orderitems = orderItem_repo.findOrderItemsByOrderIdxAndOrderItemIdxIn(reqItems.getOrderIdx(), reqItems.getItemIdxs());
	    Integer successCnt = 0;
	    
	    if (Orderitems.isEmpty()) {
			throw new IllegalArgumentException("처리할 상품이 없습니다.");
		}

		// 전체 리스트 검증 (DB 변경 X)
	    for (OrderItem item : Orderitems) {
	        // 이미 환불 또는 반품 완료 상태 체크
	        if (item.getOrderStatus().equals(OrderStatus.반품완료)) {
	        	throw new IllegalStateException("이미 반품처리된 상품은 접수 불가.");
	        }

	        // 상태 변경
	        item.setOrderStatus(OrderStatus.반품회수);
	        item.setRefundAcceptedAt(LocalDateTime.now()); //승인날짜 (=수거요청날짜) 
	        item = orderItem_repo.save(item);  //db저장
	        
	        System.out.println("item : " + item);
	        successCnt++;
	    }

	  //요청한 상품의 개수와 db변경된 개수가 일치할경우(모두 성공)
        if(Orderitems.size() == successCnt) {
        	 return new SaveResultDto(true,null,"요청한 상품의 반품 수거 요청 처리가 완료되었습니다");
        	 
        }else {
        	return new SaveResultDto(false,null,"요청 처리 실패");
        }
	}
	
	// 환불처리
	@Override
	@Transactional
	public SaveResultDto refundItems(Integer orderIdx, List<Integer> itemIdxs) {
		//주문 조회
	    Order order = order_repo.findById(orderIdx).orElseThrow(() -> new IllegalArgumentException("주문 없음"));
	    
		//해당 주문의 해당 itemIdx 목록만 조회 (주문 소속 검증+현재 OrderStatus 확인)
	    List<OrderItem> orderItems = orderItem_repo.findOrderItemsByOrderIdxAndOrderItemIdxIn(orderIdx, itemIdxs);
		if (orderItems.isEmpty()) {
			throw new IllegalArgumentException("환불할 상품이 없습니다.");
		}
		if (orderItems.size() != itemIdxs.size()) {
		    throw new IllegalArgumentException("주문에 포함되지 않은 상품이 포함되어 있습니다.");
		}

		//전체 리스트 검증 (DB 변경 X)
	    for (OrderItem item : orderItems) {

	        // 이미 환불 또는 반품 완료 상태 체크
	        if (item.getOrderStatus() == OrderStatus.반품완료) {
	        	throw new IllegalStateException("이미 반품처리된 상품은 환불 불가. (상품번호: " + item.getOrderItemIdx() + ")");
	        }
	        if (item.getRefundIdx() == null) {
	            throw new IllegalStateException("refundIdx가 없는 상품: " + item.getOrderItemIdx());
	        }
	    }
	    
	    //OrderItem -> refundIdx 기준 그룹핑
	    Map<Integer, List<OrderItem>> refundGroups =
	            orderItems.stream()
	                    .collect(Collectors.groupingBy(OrderItem::getRefundIdx));

	    //결제 정보 조회
	    Payment payment = payment_repo.findById(order.getPaymentIdx()).orElseThrow(() -> new IllegalArgumentException("결제 정보 없음"));

	    String paymentKey = payment.getPaymentKey();
	    
	    //refundIdx 단위 처리
	    for (Map.Entry<Integer, List<OrderItem>> entry : refundGroups.entrySet()) {

	        Integer refundIdx = entry.getKey();
	        List<OrderItem> items = entry.getValue();

	        Refund refund = refund_repo.findById(refundIdx).orElseThrow(() -> new IllegalArgumentException("반품 정보 없음"));

	        // 셀러 단일성 검증
	        Set<String> sellerSet = items.stream().map(i -> i.getProduct().getSellerUsername()).collect(Collectors.toSet());

	        if (sellerSet.size() != 1) {
	            throw new IllegalStateException("서로 다른 셀러 상품이 하나의 refund로 묶임");
	        }

	        // 환불 금액 계산
	        long cancelAmount = RefundAmountCalculator.calculateOrderItemTotal(items);

	        // 배송비 환불
	        if (refund.getShippingChargeType() == RefundShippingChargeType.SELLER) {
	            cancelAmount += refund.getReturnShippingFee();
	        }

	        // toss 결제 취소
	        cancelPayment(paymentKey, cancelAmount, refund);
	    }
	    
	    //상태 변경
	    for (OrderItem item : orderItems) {
	        item.setOrderStatus(OrderStatus.반품완료);
	        item.setRefundComplatedAt(LocalDateTime.now());
	    }
	    
	    // 주문 결제 상태 갱신
	    boolean allRefunded = !orderItem_repo.existsByOrderIdxAndOrderStatusNot(orderIdx, OrderStatus.반품완료);

	    if (allRefunded) {
	        order.setPaymentStatus(PaymentStatus.결제취소);
	    } else {
	        order.setPaymentStatus(PaymentStatus.부분취소); 
	    }
	    
	    return new SaveResultDto(true, null, "요청한 상품의 환불처리가 완료되었습니다.");
	}
	
	
	//toss 결제 취소 
	@Transactional
	private void cancelPayment( String paymentKey, long cancelAmount, Refund refund){
		//Authorization 헤더 생성
	    String encodedKey = Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON);
	    headers.set("Authorization", "Basic " + encodedKey);

	    String cancelReason = "반품(" + refund.getReasonType() + ")";
	    if (refund.getReasonDetail() != null && !refund.getReasonDetail().isBlank()) {
	        cancelReason += ": " + refund.getReasonDetail();
	    }

	    Map<String, Object> body = new HashMap<>();
	    body.put("cancelReason", cancelReason);
	    body.put("cancelAmount", cancelAmount);

	    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
	    RestTemplate restTemplate = new RestTemplate();

	    try {
	        restTemplate.postForEntity("https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel",
						                request,
						                String.class);
	    } catch (HttpClientErrorException e) {
	        throw new IllegalStateException(
	                "토스 결제 취소 실패: " + e.getResponseBodyAsString()
	        );
	    }
		
	}
	
}
