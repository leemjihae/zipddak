package com.zipddak.util;

import java.util.List;

import com.zipddak.entity.OrderItem;
import com.zipddak.entity.Refund.RefundShippingChargeType;

public final class RefundAmountCalculator {

    private RefundAmountCalculator() {}

    //환불 금액 계산
    public static long calculateOrderItemTotal(List<OrderItem> items) {
        return items.stream().mapToLong(i -> i.getUnitPrice() * i.getQuantity()).sum();
    }
    
    
    //환불 금액 계산
    public static long calculate(long sellerOrderTotal,long refundProductTotal,long basicPostCharge,long freeChargeAmount,long returnShippingFee,RefundShippingChargeType shippingChargeType) {

    	// 반품 후 잔여 금액
        long remainingAmount = sellerOrderTotal - refundProductTotal;
        //환불금액
        long refundAmount;

        if (shippingChargeType == RefundShippingChargeType.BUYER) {
        	//구매자 귀책 
            boolean wasFreeShipping = sellerOrderTotal >= freeChargeAmount;
            boolean isStillFreeShipping = remainingAmount >= freeChargeAmount;

            if (wasFreeShipping && !isStillFreeShipping) {
				//무료배송이었을 경우  초기 배송비 + 반품 배송비 차감
//            	refundAmount = refundProductTotal - (basicPostCharge * 2);
                refundAmount = refundProductTotal - returnShippingFee;
            } else {
            	// 무료배송 유지 or 초기 배송비를 지불한 경우 
		        // 반품 배송비(편도)만 차감
                refundAmount = refundProductTotal - basicPostCharge;
            }

        } else {
        	//판매자 귀책 -> 환불금액 = 상품 금액 (배송비 차감 없음)
            refundAmount = refundProductTotal;
        }

        return Math.max(refundAmount, 0);  //음수 방지 
    }
}
