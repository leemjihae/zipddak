package com.zipddak.mypage.dto;

import java.sql.Date;

import com.zipddak.entity.OrderItem.OrderStatus;
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
public class OrderItemFlatDto {
	private Integer orderIdx; // 주문 아이디
	private String orderCode; // 주문 코드
	private Date orderDate; // 주문 날짜

	private String brandName; // 브랜드 이름
	private ReceiveWay deliveryType; // “택배배송 post" | "직접픽업 pickup”
	private PostType deliveryFeeType; // "개별배송 single" | "묶음배송 bundle”
	private Long deliveryFeePrice; // 상품 기본 배송비 금액
	private Long freeChargeAmount; // 브랜드 무료배송 기준 금액

	private Integer orderItemIdx; // 주문상품 아이디
	private Integer productIdx; // 상품 아이디
	private String productName; // 상품명
	private String optionName; // 옵션명
	private Integer quantity; // 수량
	private Long price; // 가격
	private Long salePrice; // 세일 가격
	private Long productPrice; // 상품 정가
	private String thumbnail; // 썸네일
	private String trackingNo; // 송장번호
	private String postComp; // 택배사
	private OrderStatus orderStatus; // 주문상태
	private Boolean reviewAvailable; // 후기작성가능 여부(배송완료 전이거나 이미 작성했을 시 fasle)
	private String exchangeOption; // 교환 시 선택된 옵션
}
