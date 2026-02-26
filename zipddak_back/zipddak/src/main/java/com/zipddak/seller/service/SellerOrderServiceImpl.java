package com.zipddak.seller.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zipddak.dto.OrderDto;
import com.zipddak.dto.OrderItemDto;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.repository.OrderRepository;
import com.zipddak.seller.dto.DeliveryGroupDto;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.dto.SellerOrderRowDto;
import com.zipddak.seller.dto.SellerOrderSummaryDto;
import com.zipddak.seller.repository.SellerOrderRepository;
import com.zipddak.util.SellerOrderSummaryCalculator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerOrderServiceImpl implements SellerOrderService {

	private final OrderRepository order_repo;
	private final OrderItemRepository orderItem_repo;
	private final SellerOrderRepository sellerOrder_repo;
	
	@Autowired
	private final SellerMypageService mypage_svc;

	//주문 리스트 
	@Override
	public Map<String, Object> getMyOrderList(String sellerUsername, Integer page,  SearchConditionDto scDto) throws Exception {
		PageRequest pr = PageRequest.of(page - 1, 10);
		
		List<OrderDto> myOrderList = sellerOrder_repo.searchMyOrders(sellerUsername, pr, scDto);  //주문리스트
		Long myOrderCount = sellerOrder_repo.countMyOrders(sellerUsername, scDto);	//주문서 개수 

        int allPage = (int) Math.ceil(myOrderCount / 10.0);
        int startPage = (page - 1) / 10 * 10 + 1;
        int endPage = Math.min(startPage + 9, allPage);

        Map<String, Object> result = new HashMap<>();
        result.put("curPage", page);
        result.put("allPage", allPage);
        result.put("startPage", startPage);
        result.put("endPage", endPage);
        result.put("myOrderList", myOrderList);
        result.put("myOrderCount", myOrderCount);
        
		return result;
	}

	// 주문 내역 상세보기 
	@Override
	public Map<String, Object> getMyOrderDetail(String sellerUsername, Integer orderIdx) throws Exception {
		 // 1. 주문 기본 정보
	    OrderDto orderDto = sellerOrder_repo.findByOrderId(orderIdx);
	    if (orderDto == null) {
	        throw new Exception("주문 없음");
	    }

	    // 2. 셀러 소유 주문 상품
	    List<OrderItemDto> itemList = sellerOrder_repo.findMyOrderItems(sellerUsername, orderIdx);
	    if (itemList.isEmpty()) {
	        throw new Exception("해당 주문은 이 셀러의 상품이 아님");
	    }

	    // 3. 셀러 기준 주문 row
	    List<SellerOrderRowDto> orderRows = sellerOrder_repo.findSellerOrderRows(sellerUsername, orderIdx);
	    if (orderRows == null || orderRows.isEmpty()) {
	        throw new Exception("해당 판매자의 주문 없음");
	    }

	    // 4. 셀러 주문 금액 계산
	    SellerOrderSummaryDto summary = SellerOrderSummaryCalculator.calculate(orderRows);

	    // 5. 결과 구성
	    Map<String, Object> result = new HashMap<>();
	    result.put("orderData", orderDto);
	    result.put("myOrderItemList", itemList);
	    result.put("freeChargeAmount", orderRows.get(0).getSellerFreeChargeAmount());
	    result.put("sellerOrderSummary", summary);

	    return result;
	}

	//자동 배송완료 처리 
	@Override
	@Transactional
	public void autoCompleteDelivery() {
		// 배송 시작 후 10분 경과 기준
	    LocalDateTime referenceTime = LocalDateTime.now().minusMinutes(10);

	    // 배송완료 가능한 (택배사 + 운송장번호) 묶음 조회
	    List<DeliveryGroupDto> groups = sellerOrder_repo.findAutoCompleteDeliveryGroups(referenceTime);

	    if (groups.isEmpty()) {
	        return;
	    }

	    // 묶음 단위 배송완료 처리
	    for (DeliveryGroupDto group : groups) {
	        List<OrderItem> targets = sellerOrder_repo.findByCarrierAndTrackingNoAndStatus(
										                        group.getPostComp(),
										                        group.getTrackingNo(),
										                        OrderStatus.배송중
										                );
	        // 엔티티 상태 변경 
	        targets.forEach(OrderItem::completeDelivery);
	    }
        System.out.println("!!!배송완료 변경처리 완료!!!");
		
	}

	


}
