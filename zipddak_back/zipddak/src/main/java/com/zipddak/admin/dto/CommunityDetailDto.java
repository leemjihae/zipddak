package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDetailDto {

	private Integer communityId; // 글 id
	private String cateName; // 카테고리 이름
	private String title; // 글 제목
	private Date createdAt; // 글 작성일
	private Integer viewCount; // 조회수
	private String content; // 내용
	private String img1;
	private String img2;
	private String img3;
	private String img4;
	private String img5; 
	private String communityStoragePath; // 커뮤니티 이미지 파일 저장 경로 
	
	private String nickname; // 작성자 닉네임
	private String imgFile; // 작성자 이미지
	private String imgStoragePath; // 작성자 이미지 저장 경로
	
}
