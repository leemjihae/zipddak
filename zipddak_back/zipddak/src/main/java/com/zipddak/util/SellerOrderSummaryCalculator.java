package com.zipddak.util;

import java.util.List;

import org.springframework.stereotype.Component;

import com.zipddak.seller.dto.SellerOrderRowDto;
import com.zipddak.seller.dto.SellerOrderSummaryDto;
import com.zipddak.entity.Product.PostType;

//주문상세용 계산 전용 클래스 (셀러별 주문 금액)
public final class SellerOrderSummaryCalculator {
	
	private SellerOrderSummaryCalculator() {}
	
	//주문상세, 반품 전후 공통 계산
	public static SellerOrderSummaryDto calculate(List<SellerOrderRowDto> rows) {

		//해당 셀러 상품이 하나도 없는 경우
		if (rows == null || rows.isEmpty()) {
            return new SellerOrderSummaryDto(0L, 0L, 0L);
        }

        long productTotal = 0; //상품 금액 합
        long shippingTotal = 0; //배송비 합

        long bundleProductTotal = 0; //묶음배송 상품 금액 합
        boolean hasBundle = false; //묶음배송 상품 존재 여부(무료배송 판단용)

        //셀러 배송 정책
        long basicPostCharge = rows.get(0).getSellerBasicPostCharge(); 
        long freeChargeAmount = rows.get(0).getSellerFreeChargeAmount();

        for (SellerOrderRowDto row : rows) {
            long itemTotal = row.getUnitPrice() * row.getQuantity(); //해당 상품의 실 결제 금액
            productTotal += itemTotal;	//주문 상품 총액에 누적

            //개별배송 상품 분기
            if (row.getPostType() == PostType.single) {
                shippingTotal += row.getPostCharge() * row.getQuantity(); //개별배송은 상품 1개당 배송비
                
            } else if (row.getPostType() == PostType.bundle) {
                hasBundle = true;
                bundleProductTotal += itemTotal; //무료배송 판단용 금액 누적
            }
        }

        //묶음배송 상품이 있고, 무료배송 기준 금액 미달이면, 기본 배송비 1회 추가
        if (hasBundle && bundleProductTotal < freeChargeAmount) {
            shippingTotal += basicPostCharge;
        }

        return new SellerOrderSummaryDto(productTotal,
								            shippingTotal,
								            productTotal + shippingTotal  //총 결제 금액
        );
    }

}
