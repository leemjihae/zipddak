package com.zipddak.mypage.dto;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderListDto {
	private Integer orderIdx; // 주문 아이디
	private String orderCode; // 주문 코드
	private Date orderDate; // 주문 날짜
	private Boolean canCancel; // 취소 가능여부
	private Boolean canReturn; // 교환환불 가능여부
	private List<DeliveryGroupsDto> deliveryGroups; // 주문상품들
}
