package com.zipddak.mypage.dto;

import java.sql.Date;

import com.zipddak.entity.Exchange.ShippingChargeType;
import com.zipddak.entity.Refund.RefundShippingChargeType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDto {
	private Integer orderIdx; // 주문 아이디
	private String orderCode; // 주문 코드
	private Date orderDate; // 주문 날짜

	private Long totalProductPrice; // 총 상품금액
	private Long totalDeliveryFee; // 총 배송비
	private Integer totalPaymentPrice; // 결제금액
	private String paymentMethod; // 결제방법

	private String ordererName; // 주문자 이름
	private String ordererPhone; // 주문자 휴대폰번호

	private String receiverName; // 수령인 이름
	private String receiverPhone; // 수령인 휴대폰번호
	private String postCode; // 우편번호
	private String address1; // 도로명주소
	private String address2; // 상세주소
	private String deliveryMessage; // 배송요청사항

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class CancelInfo {
		private Integer cancelIdx; // 취소 아이디
		private Integer cancelAmount; // 취소금액
		private Date cancelDate; // 취소날짜
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class ExchangeInfo {
		private Integer exchangelIdx; // 교환 아이디
		private ShippingChargeType shippingChargeType; // 배송비부담주체
		private Integer roundShippingFee; // 왕복배송비

		private String reasonType; // 교환사유 타입
		private String reasonDetail; // 교환사유 내용
		private Integer image1Idx; // 교환사유 이미지1
		private Integer image2Idx; // 교환사유 이미지1
		private Integer image3Idx; // 교환사유 이미지1

		private String reshipName; // 재배송 수령인 이름
		private String reshipPhone; // 재배송 수령인 휴대폰번호
		private String reshipZipcode; // 재배송 우편번호
		private String reshipAddr1; // 재배송 도로명 주소
		private String reshipAddr2; // 재배송 상세 주소
		private String reshipPostMemo; // 재배송 배송 메시지

		private String pickupPostComp; // 회수 택배사
		private String pickupTrackingNo; // 회수 운송장번호
		private String reshipPostComp; // 재배송 택배사
		private String reshipTrackingNo; // 재배송 운송장번호

		private Date exchangeDate; // 교환날짜
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class RefundInfo {
		private Integer refundIdx; // 환불 아이디
		private RefundShippingChargeType shippingChargeType; // 배송비부담주체
		private Integer returnShippingFee; // 반품배송비
		private Integer refundAmount; // 환불금액

		private String reasonType; // 환불사유 타입
		private String reasonDetail; // 환불사유 내용
		private Integer image1Idx; // 환불사유 이미지1
		private Integer image2Idx; // 환불사유 이미지1
		private Integer image3Idx; // 환불사유 이미지1

		private Date refundDate; // 환불날짜
	}
}
