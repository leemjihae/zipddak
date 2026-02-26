package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeforeProductReviewDto {
	private String brandName; // 브랜드명
	private String productThumbnail; // 상품 썸네일 저장경로
	private String productName; // 상품명

	private Integer productIdx; // 상품 아이디
	private Integer orderItemIdx; // 주문 아이디
}
