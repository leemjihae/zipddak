package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestActiveExpertListDto {
	private Integer estimateIdx; // 견적서 아이디
	private String activityName; // 전문가 활동명
	private String profileImage; // 전문가 프로필 이미지
	private Integer totalCost; // 견적 총액
}
