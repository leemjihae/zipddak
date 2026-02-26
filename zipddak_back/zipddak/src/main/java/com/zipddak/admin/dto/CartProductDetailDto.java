package com.zipddak.admin.dto;

import com.zipddak.entity.Product.PostType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartProductDetailDto {

	private Integer optionIdx; // 옵션 번호
	private Integer productIdx; // 상품 번호
	private Integer cartIdx; // 카트 번호
	private String productImg; // 상품 이미지
	private String imgStoragePath; // 상품 이미지 경로
	private String productName; // 상품 이름
	private String optionName; // 옵션 이름
	private String optionValue; // 옵션 선택값
	private Integer quantity; // 수량
	private long productSalePrice; // 상품 판매가
	private long productPrice; // 상품 정가
	private long optionPrice; // 옵션 가격
	private PostType postType; // 배송 단위
	private long postCharge; // 배송비 -> 개별배송일때만 사용
	private Integer sellerIdx; // 판매업체 idx
	// -> 배송 단위가 묶음 일때는 판매업체의 기본 배송비를 사용
}
