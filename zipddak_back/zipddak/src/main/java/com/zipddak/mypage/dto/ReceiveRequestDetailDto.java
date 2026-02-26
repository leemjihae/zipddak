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
public class ReceiveRequestDetailDto {
	private Integer requestIdx; // 요청서 아이디
	private Date createdAt; // 등록일
	
	private String name; // 요청자 이름
	private String phone; // 요청자 휴대폰번호

	private Integer largeServiceIdx; // 대분류 카테고리 아이디
	private String categoryName; // 카테고리 이름
	private String location; // 장소
	private Integer budget; // 예산
	private Date preferredDate; // 희망일
	private String constructionSize; // 시공사이즈
	private String additionalRequest; // 추가 요청사항
	private String purpose; // 시공목적
	private String place; // 시공할공간

	private String image1; // 이미지1 저장경로
	private String image2; // 이미지2 저장경로
	private String image3; // 이미지3 저장경로
}
