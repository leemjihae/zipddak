package com.zipddak.mypage.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyProductReviewDto {
	private Integer reviewProductIdx; // 상품리뷰 아이디

	private Integer score; // 평점
	private String content; // 내용
	private String img1; // 후기 이미지1 저장경로
	private String img2; // 후기 이미지2 저장경로
	private String img3; // 후기 이미지3 저장경로
	private Integer img1Idx; // 후기 이미지1 아이디
	private Integer img2Idx; // 후기 이미지2 아이디
	private Integer img3Idx; // 후기 이미지3 아이디
	private Date createdate; // 작성일

	private String brandName; // 브랜드명
	private String productThumbnail; // 상품 썸네일 저장경로
	private String productName; // 상품명
}
