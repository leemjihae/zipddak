package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertCardDto {

	private Integer expertIdx; // 전문가 pk
	private String imgFileRename; // 이미지 파일 이름
	private String imgStoragePath; // 이미지 파일 경로
	private String activityName; // 활동명
	private Integer mainServiceIdx; // 대표 서비스 idx
	private String mainServiceName; // 대표 서비스 이름
	private Double avgRating; // 평점
	private long reviewCount; // 리뷰수
	private String introduction; // 자기소개
	private long matchingCount; // 매칭수
	private Integer career; // 경력 -> @년
	private String addr1;
	private String addr2;
}
