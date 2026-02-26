package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCardDto {
	private Integer productIdx; // 상품 ID
	private String name; // 상품 이름
	private Integer discount; // 할인율
	private Long salePrice; // 판매가격
	private String sellerUsername; // 판매자 ID
	private String fileRename; // 썸네일 파일 이름
	private String storagePath; // 사진 저장 경로
	private Double avgRating; // 평점
	private Long reviewCount; // 리뷰 수
	private String brandName; // 상호명
	private Boolean favorite; // 관심 표시
	private Long price;
}
