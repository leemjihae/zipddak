package com.zipddak.seller.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.dto.OrderItemDto;
import com.zipddak.dto.RefundDto;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.Refund.RefundShippingChargeType;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.repository.RefundRepository;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.dto.SellerOrderAmountDto;
import com.zipddak.seller.repository.SellerRefundRepository;
import com.zipddak.util.RefundAmountCalculator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerRefundServiceImpl implements SellerRefundService {

	private final RefundRepository refund_repo;
	private final OrderItemRepository orderItem_repo;
	private final SellerRefundRepository sellerRefund_repo;

	//반품 요청 리스트 
	@Override
	public Map<String, Object> getMyRefundList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception {
		PageRequest pr = PageRequest.of(page - 1, 10);

		List<RefundDto> myRefundList = sellerRefund_repo.searchMyRefunds(sellerUsername, pr, scDto); // 반품 진행 리스트
		Long myRefundCount = sellerRefund_repo.countMyRefunds(sellerUsername, scDto); // 반품 진행 개수
		
System.out.println("myRefundList : " + myRefundList);

		int allPage = (int) Math.ceil(myRefundCount / 10.0);
		int startPage = (page - 1) / 10 * 10 + 1;
		int endPage = Math.min(startPage + 9, allPage);

		Map<String, Object> result = new HashMap<>();
		result.put("curPage", page);
		result.put("allPage", allPage);
		result.put("startPage", startPage);
		result.put("endPage", endPage);
		result.put("myRefundList", myRefundList);
		result.put("myRefundCount", myRefundCount);

		return result;
	}
	
	//반품요청 상세보기
	@Override
	public Map<String, Object> getRefundReqDetail(String sellerUsername, Integer refundIdx) {
		System.out.println("sellerUsername : " + sellerUsername);
		System.out.println("refundIdx : " + refundIdx);
		
		// 반품 요청된 주문정보
		RefundDto refundOrderData = sellerRefund_repo.findRefundOrderId(sellerUsername, refundIdx);
		if (refundOrderData == null) {
	        throw new IllegalStateException("반품 요청 없음");
	    }
		System.out.println("refundOrderData : " + refundOrderData);
		// 반품요청된 주문상품정보 
		List<OrderItemDto> refundOrderItemList = sellerRefund_repo.findRefundOrderItemList(sellerUsername, refundIdx);
		    if (refundOrderItemList.isEmpty()) {
		        throw new IllegalStateException("해당 주문상품은 이 셀러의 상품이 아님");
		}
		    
		//구매자가 주문한 주문상품의 특정 셀러 총금액확인용 (무료배송 여부 확인용)
		SellerOrderAmountDto orderTotalAmountBySeller = sellerRefund_repo.findSellerOrderAmount(sellerUsername, refundOrderData.getOrderIdx());
		//이 반품건의 반품상품 금액만 계산
		Long refundProductTotal = sellerRefund_repo.findRefundProductTotal(sellerUsername, refundIdx, refundOrderData.getOrderIdx() );

		long sellerOrderTotal = orderTotalAmountBySeller.getSellerOrderTotal();
		long basicPostCharge = orderTotalAmountBySeller.getBasicPostCharge();
		long freeChargeAmount = orderTotalAmountBySeller.getFreeChargeAmount();
		
		//환불금액 계산 
		long refundAmount = RefundAmountCalculator.calculate(sellerOrderTotal,
													        refundProductTotal,
													        basicPostCharge,
													        freeChargeAmount,
													        refundOrderData.getReturnShippingFee(),
													        RefundShippingChargeType.valueOf(refundOrderData.getShippingChargeType()));
		    
	    Map<String, Object> result = new HashMap<>();
	    result.put("refundOrderData", refundOrderData);
	    result.put("refundOrderItemList", refundOrderItemList);
	    result.put("refundProductTotal", refundProductTotal);
	    result.put("refundAmount", refundAmount);
		
		return result;
	}


	
	
	

	



	

}
