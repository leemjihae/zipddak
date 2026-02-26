package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductReviewsDto {
	
	private Integer reviewProductIdx; // 리뷰 아이디
	private Integer score; // 리뷰 평점
	private String content; // 리뷰 내용
	private Date createdate; // 작성일
	private String nickname; // 작성자 닉네임
	
	// 이미지	
	private String img1Name; // 이미지 1 이름
	private String img2Name; // 이미지 2 이름
	private String img3Name; // 이미지 3 이름
	// 이미지 경로
	private String img1Path; // 이미지 1 경로
	private String img2Path; // 이미지 2 경로
	private String img3Path; // 이미지 3 경로
	
}
