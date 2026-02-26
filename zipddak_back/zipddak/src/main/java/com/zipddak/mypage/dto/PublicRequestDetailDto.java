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
public class PublicRequestDetailDto {
	private Integer requestIdx; // 요청서 아이디
	private Date createdAt; // 등록일
	private Long expertResponseCount; // 견적 보낸 전문가 수

	private String requesterName; // 요청자 이름
	private String requesterProfile; // 요청자 프로필 이미지
	private Long requesterMatchCount; // 요청자 매칭 횟수

	private Integer largeServiceIdx; // 대분류 카테고리 아이디
	private Integer midServiceIdx; // 중분류 카테고리 아이디
	private Integer smallServiceIdx; // 소분류 카테고리 아이디
	private String categoryName; // 카테고리 이름
	private String location; // 장소
	private Integer budget; // 예산
	private Date preferredDate; // 희망일
	private String constructionSize; // 시공 사이즈
	private String additionalRequest; // 추가 요청사항

	private String image1; // 이미지1 저장경로
	private String image2; // 이미지1 저장경로
	private String image3; // 이미지1 저장경로

	private String purpose; // 시공 목적
	private String place; // 시공할 공간
}
