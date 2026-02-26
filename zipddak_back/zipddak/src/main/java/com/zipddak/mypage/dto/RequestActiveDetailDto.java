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
public class RequestActiveDetailDto {
	/* 요청서 */
	private Integer requestIdx; // 요청서 아이디
	private Date requestAt; // 요청일
	private String largeServiceName; // 서비스 대분류 이름
	private String midServiceName; // 서비스 중분류 이름
	private String smallServiceName; // 서비스 소분류 이름

	private Integer budget; // 예산
	private Date preferredDate; // 희망 시공일
	private String location; // 시공 장소
	private String constructionSize; // 시공 사이즈
	private String purpose; // 시공 목적
	private String place; // 시공할 공간
	private String additionalRequest; // 추가 요청사항
	private String status; // 요청서 진행 상태
	private String image1Idx;
	private String image2Idx;
	private String image3Idx;
}
