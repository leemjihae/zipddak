package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertReviewDetailDto {

	private Integer reviewIdx;
	
	private String imgStoragePath; // 이미지 저장 경로
	private String image1; // 이미지 1
	private String image2; // 이미지 2
	private String image3; // 이미지 3
	
	private String nickname; // 닉네임
	private String profileImgStoragePath; // 리뷰어 이미지 경로
	private String profileImg; // 리뷰어 이미지
	
	private Integer score; // 평점
	private Date createdAt; // 댓글 단 날
	private String content; // 리뷰 내용
	
	
	
}
