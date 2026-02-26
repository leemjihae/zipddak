package com.zipddak.admin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.ExpertCareerDto;
import com.zipddak.dto.CareerDto;
import com.zipddak.entity.Career;
import com.zipddak.repository.CareerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertCareerServiceImpl implements ExpertCareerService {

	private final CareerRepository careerRepository;
	
	// 경력 내용
	@Override
	public ExpertCareerDto expertCareer(Integer expertIdx) throws Exception {
		
		Long careerMonths = careerRepository.getTotalMonthsByExpertIdx(expertIdx);
		
		List<CareerDto> careerDtoList = careerRepository.findByExpertIdx(expertIdx).stream()
											.map(Career::toDto)
											.collect(Collectors.toList());
		
		return new ExpertCareerDto(careerMonths, careerDtoList);
	}

}
