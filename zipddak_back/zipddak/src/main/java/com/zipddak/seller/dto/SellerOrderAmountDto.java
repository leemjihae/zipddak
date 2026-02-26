package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerOrderAmountDto {
	
	private Integer orderIdx;
    private Long sellerOrderTotal;        // 주문 당시 셀러 상품 총액
    private String sellerUsername; //셀러id
    private Long basicPostCharge; //기본 배송비 
    private Long freeChargeAmount; //무료배송금액 
    private Long singlePostCarge; //개별배송상품 배송비 

}
