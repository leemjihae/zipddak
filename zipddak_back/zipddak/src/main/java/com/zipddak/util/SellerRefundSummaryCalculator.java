package com.zipddak.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.zipddak.entity.Refund.RefundShippingChargeType;
import com.zipddak.seller.dto.SellerOrderRowDto;
import com.zipddak.seller.dto.SellerOrderSummaryDto;
import com.zipddak.seller.dto.SellerRefundSummaryDto;

//반품용 계산 전용 클래스 (셀러 주문 금액)
public final class SellerRefundSummaryCalculator {
	
	private SellerRefundSummaryCalculator() {}
	
	public static SellerRefundSummaryDto calculate(List<SellerOrderRowDto> allRows,
													Map<Integer, Integer> refundQuantityMap, 
											        long returnShippingFee,
											        RefundShippingChargeType chargeType) {
		//allRows : 해당 셀러의 주문 당시 전체 상품
		//refundQuantityMap : orderItemIdx 반품수량
		//returnShippingFee : 반품 배송비 
		//chargeType : 구매자 귀책 / 판매자 귀책
		
	    SellerOrderSummaryDto before = SellerOrderSummaryCalculator.calculate(allRows); //반품 전 주문 상태 (배송비 포함된 원래 결제)
	    List<SellerOrderRowDto> afterRows = subtractRows(allRows, refundQuantityMap); //반품 상품 제거 (반품 후 주문 상태 생성)
	    SellerOrderSummaryDto after = SellerOrderSummaryCalculator.calculate(afterRows); //반품 후 기준으로 배송비 재계산

	    long refundProductAmount = before.getProductTotal() - after.getProductTotal(); //실제 환불되는 상품 금액

        long refundShippingAmount = 0; //배송비 환불(차감용 변수)

        if (chargeType == RefundShippingChargeType.BUYER) { //구매자 귀책일 경우만 배송비 차감
            refundShippingAmount = (before.getShippingTotal() - after.getShippingTotal()) + returnShippingFee;
            //무료배송 깨지면 반품배송비 다시 붙음
        }

        long finalRefundAmount = refundProductAmount - refundShippingAmount; //최종 환불 금액 계산

	    return new SellerRefundSummaryDto(refundProductAmount, refundShippingAmount, Math.max(finalRefundAmount, 0));
	}
	
	//반품 후 상태를 만들기 위한 계산용 보조 로직
	private static List<SellerOrderRowDto> subtractRows( List<SellerOrderRowDto> allRows, Map<Integer, Integer> refundQuantityMap) {
	    
		List<SellerOrderRowDto> result = new ArrayList<>();

		for (SellerOrderRowDto row : allRows) {
			//해당 상품이 반품 대상인지 확인
	        Integer refundQty = refundQuantityMap.get(row.getOrderItemIdx());
	       

	        // 반품 안 된 상품은 그대로 유지
	        if (refundQty == null) {
	            result.add(row);
	            continue;
	        }

	        // 전량 반품 -> 상품 제거
	        if (refundQty >= row.getQuantity()) {
	            continue;
	        }

	        // 부분 반품 -> 반품 수량 줄인 새로운 row 생성
	        result.add(new SellerOrderRowDto(row.getOrderItemIdx(),
									            row.getPostType(),
									            row.getPostCharge(),
									            row.getUnitPrice(),
									            row.getQuantity() - refundQty,
									            row.getSellerBasicPostCharge(),
									            row.getSellerFreeChargeAmount()));
	    }

	    return result;
	}


}
