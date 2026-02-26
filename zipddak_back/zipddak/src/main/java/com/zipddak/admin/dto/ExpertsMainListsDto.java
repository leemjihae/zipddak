package com.zipddak.admin.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertsMainListsDto {

	private List<ExpertCardDto> addExperts; // 광고 전문가
	private List<ExpertCardDto> experts; // 일반 전문가
	
}
