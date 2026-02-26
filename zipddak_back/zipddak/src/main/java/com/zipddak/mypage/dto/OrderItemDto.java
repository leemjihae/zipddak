package com.zipddak.mypage.dto;

import com.zipddak.entity.OrderItem.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
	private Integer orderItemIdx; // 주문상품 아이디
	private Integer productIdx; // 상품 아이디
	private String productName; // 상품명
	private String optionName; // 옵션명
	private Integer quantity; // 수량
	private Long price; // 가격
	private Long salePrice; // 세일 가격
	private Long productPrice; // 상품 가격
	private String thumbnail; // 썸네일
	private String trackingNo; // 송장번호
	private String postComp; // 택배사
	private OrderStatus orderStatus; // 주문상태
	private boolean reviewAvailable; // 후기작성가능 여부(배송완료 전이거나 이미 작성했을 시 fasle)
	private String exchangeOption; // 교환 시 선택된 옵션
}
