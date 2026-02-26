package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertReviewScoreDto {

	private Double score; // 평점
	private long reviewCount; // 리뷰 수
	
}
