package com.zipddak.seller.dto;

import com.zipddak.entity.Product.PostType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerOrderRowDto {
	//셀러 주문 금액 조회용 DTO  (주문/반품 공통)
	
	private Integer orderItemIdx;
	private PostType postType;     // bundle, single
    private Long postCharge;      // 상품 배송비 (개별배송용)
    private Long unitPrice;
    private Integer quantity;

    private Long sellerBasicPostCharge;   // 셀러 기본 배송비
    private Long sellerFreeChargeAmount;  // 무료배송 기준금액

}
