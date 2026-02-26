package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusSummaryDto {
	private Integer readyStatus; // 상품준비중
	private Integer shippingStatus; // 배송중
	private Integer deliveredStatus; // 배송완료
	private Integer returnsStatus; // 취소/교환/환불

}
