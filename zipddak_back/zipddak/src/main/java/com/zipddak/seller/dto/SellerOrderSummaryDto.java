package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerOrderSummaryDto {
	//주문상세용 계산 (셀러 주문 금액) DTO -주문상세용
	
    private long productTotal;
    private long shippingTotal;
    private long finalTotal;

}
