package com.zipddak.admin.dto;

import com.zipddak.entity.Portfolio.WorkTimeType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertPortfolioDto {

	private Integer portfolioIdx; // 포트폴리오 번호
	private String title; // 포트폴리오 제목
	private Integer serviceIdx; // 서비스 카테고리 idx
	private String serviceName; // 서비스 카테고리 이름
	private String region; // 지역
	private Integer price; // 가격
	private WorkTimeType workTimeType; // 작업 시간 단위
	private Integer workTimeValue; // 작업 시간 숫자
	private String image1; // 이미지 1 경로
	private String image2; // 이미지 2 경로
	private String image3; // 이미지 3 경로
	private String description; // 포트폴리오 설명
	private String imagePath; // 이미지 저장 경로
	
}
