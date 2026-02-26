package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeforeExpertReviewDto {
	private String activityName; // 전문가 활동명
	private String expertThumbnail; // 전문가 썸네일 저장경로
	private String matchingServiceName; // 진행한 전문가 서비스명

	private Integer expertIdx; // 전문가 아이디
	private Integer matchingIdx; // 매칭 아이디
}
