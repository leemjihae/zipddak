package com.zipddak.admin.dto;

import lombok.Data;

import java.util.List;

import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertReviewDto {

	private ExpertReviewScoreDto expertReviewScoreDto;
	private ResponseReviewListAndHasnext reviewList;
	
}
