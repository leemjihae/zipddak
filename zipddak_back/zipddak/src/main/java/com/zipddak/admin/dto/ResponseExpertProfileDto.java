package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.dto.CategoryDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseExpertProfileDto {

	private ExpertProfileDto expertProfile;
	private List<CategoryDto> categoryList;
	private ExpertCareerDto careerDto;
	private List<ExpertPortfolioDto> portFolioDtoList;
	private ExpertReviewDto expertReviewDto;
	private Boolean favorite;
	
}
