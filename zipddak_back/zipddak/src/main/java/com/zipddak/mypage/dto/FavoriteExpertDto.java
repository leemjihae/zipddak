package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteExpertDto {
	private Integer expertIdx; // 전문가 아이디
	private String activityName; // 전문가 활동명
	private String profileImage; // 프로필 이미지 경로
	private String mainService; // 대표 서비스 카테고리명

	private String activityArea; // 활동지역
	private Integer careerCount; // 경력 기간
	private Long matchingCount; // 고용 횟수

	private Integer avgScore; // 평균 평점
	private Long reviewCount; // 후기 개수
}
