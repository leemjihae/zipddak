package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartListDto {

	private Integer cartIdx; // 카트 번호
	private String fileRename; // 상품 이미지 이름
	private String productName; // 상품 이름
	private String optionName; // 옵션 이름
	private String optionValue; // 옵션 색상
	private Integer quantity; // 상품 수량
	private long productSalePrice; // 상품 판매가
	private long optionPrice; // 옵션 가격
//	private 
	
}
