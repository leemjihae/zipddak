package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteProductDto {
	private Integer productIdx; // 상품 아이디
	private String productName; // 상품명
	private String thumbnail; // 썸네일 경로
	private Long salePrice; // 판매가격
	private Integer discount; // 할인률

	private String brandName; // 브랜드 이름

	private Integer avgScore; // 평균 평점
	private Long reviewCount; // 후기 개수
}
