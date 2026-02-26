package com.zipddak.mypage.dto;

import java.util.List;

import com.zipddak.entity.OrderItem.ReceiveWay;
import com.zipddak.entity.Product.PostType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryGroupsDto {
	private String brandName; // 브랜드 이름
	private ReceiveWay deliveryType; // “택배배송 post" | "직접픽업 pickup”
	private PostType deliveryFeeType; // "개별배송 single" | "묶음배송 bundle”
	private Long freeChargeAmount; // 브랜드 무료배송 기준 금액
	private boolean isFreeCharge; // 무료배송 여부
	private Long deliveryFeePrice; // 상품 기본 배송비 금액
	private Long appliedDeliveryFee; // 실제 고객에게 부과된 배송비(계산된 값)
	private List<OrderItemDto> orderItems; // 동일 브랜드 & 배송 타입인 주문 상품들
}
