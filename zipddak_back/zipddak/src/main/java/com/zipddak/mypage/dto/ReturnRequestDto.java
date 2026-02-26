package com.zipddak.mypage.dto;

import java.util.List;

import com.zipddak.entity.Refund.RefundShippingChargeType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequestDto {
	private Integer orderIdx; // 주문 아이디

	private List<Integer> returnItemIdxs; // 반품 상품 아이디목록

	private String reasonType; // 반품사유 선택값
	private String reasonDetail; // 반품사유 상세

	private RefundShippingChargeType shippingChargeType; // 배송비부담주체
	private Integer returnShippingFee; // 반품배송비
	private Integer refundAmount; // 최종환불예정금액

}
