package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerRefundSummaryDto {
	//반품 계산 DTO (셀러 주문 금액 기준)
	
	private long refundProductAmount;
	private long refundShippingAmount;
	private long finalRefundAmount;

}
