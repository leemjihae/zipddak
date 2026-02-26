package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.dto.CareerDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertCareerDto {

	private Long career; // 경력 총 개월 수
	private List<CareerDto> careerList; // 경력 리스트
	
}
