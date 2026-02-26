package com.zipddak.dto;

import java.sql.Date;

import com.zipddak.entity.OrderItem;
import com.zipddak.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
	private Integer orderIdx;
	private String orderCode;
	private Long subtotalAmount;  //모든 상품 합계 금액
	private Long shippingAmount;  //모든 상품 배송비 합
	private Long totalAmount;	//subtotalAmount + shippingAmount
	private Integer paymentIdx;
	private String postZonecode;
	private String postAddr1;
	private String postAddr2;
	private String phone;
	private String postRecipient;
	private String postNote;
	private Date createdAt;
    
    private String username; 
    private String name;
    
    //join용 컬럼
    private String customerUsername;	//주문자 id
    private String customerName;	//주문자명
    private String customerPhone;	//주문자 연락처
    private OrderItem.OrderStatus orderStatus;  //주문상태
    private String productIdx;	//productIdx
    private String productName;	//product
    private Long itemCount;
    private Product.PostType postType;
    
}
