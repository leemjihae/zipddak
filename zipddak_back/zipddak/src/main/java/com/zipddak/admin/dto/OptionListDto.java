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
public class OptionListDto {

	private Integer productId; // 자재 id
	private long postCharge; // 배송비
	private String productName; // 자재명
	private long salePrice; // 판매가격
	private PostType postType; //배송 단위
	private Integer optionId; // 옵션Id
	private String name; // 옵션명
	private String value; // 선택값
	private long price; // 선택가격
	private Integer count; // 개수
	private String productImg; // 상품 이미지
	private String imgStoragePath; // 상품 이미지 경로
	private Integer sellerIdx; // 판매업체 idx
	private long productPrice; // 원래 상품 가격
	
	
}
