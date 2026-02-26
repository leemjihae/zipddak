package com.zipddak.mypage.dto;

import java.util.List;

import com.zipddak.entity.Exchange.ShippingChargeType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeRequestDto {
	private Integer orderIdx; // 주문 아이디

	private List<ExchangeItemDto> exchangeItems; // 상품 - 교환 옵션

	private String reasonType; // 교환사유 선택값
	private String reasonDetail; // 교환사유 상세

	private ShippingChargeType shippingChargeType; // 배송비부담주체
	private Integer roundShippingFee; // 왕복배송비
	private String reshipName; // 재배송 수령인 이름
	private String reshipPhone; // 재배송 수령인 휴대폰번호
	private String reshipZipcode; // 재배송 우편번호
	private String reshipAddr1; // 재배송 도로명주소
	private String reshipAddr2; // 재배송 상세주소
	private String reshipPostMemo; // 재배송 배송요청사항

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class ExchangeItemDto {
		private Integer orderItemIdx;
		private Integer newOptionIdx;
	}
}
