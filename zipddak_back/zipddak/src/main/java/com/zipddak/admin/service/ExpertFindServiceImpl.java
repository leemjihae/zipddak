package com.zipddak.admin.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.EstimatePaymentExpertDto;
import com.zipddak.admin.dto.ExpertCardDto;
import com.zipddak.admin.dto.ExpertProfileDto;
import com.zipddak.admin.repository.ExpertFindDslRepository;
import com.zipddak.entity.Expert;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertFindServiceImpl implements ExpertFindService{
	
	private final ExpertFindDslRepository expertFindDslRepository;
	private final ExpertRepository expertRepository;
	
	// 광고 전문가
	@Override
	public List<ExpertCardDto> addExperts(Integer categoryNo) throws Exception {
		
		return expertFindDslRepository.addExperts(categoryNo);
	}

	// 일반 전문가
	@Override
	public List<ExpertCardDto> experts(Integer page, Integer categoryNo, String keyword, String sort) throws Exception {
		PageInfo pageInfo = new PageInfo(page);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 9);
		
		return expertFindDslRepository.experts(pageRequest, categoryNo, keyword, sort);
	}

	// 전문가 프로필 구하기
	@Override
	public ExpertProfileDto expertProfile(Integer expertIdx) throws Exception {
		
		return expertFindDslRepository.expertProfile(expertIdx); 
	}

	@Override
	public EstimatePaymentExpertDto expertDetail(Integer estimateIdx) throws Exception {
		
		return expertFindDslRepository.expertDetail(estimateIdx);
	}

	// 전문가가 공개요청을 들어갈때 메인 서비스가 존재하지 않으면 마이페이지로 이동시켜야함
	@Override
	public boolean mainServiceCheck(String username) throws Exception {
		
		Expert expert = expertRepository.findByUser_Username(username).get();
		
		System.out.println(expert);
		
		return expert.getMainServiceIdx() != null;
	}

	@Override
	public void modifyQuestion(String username, List<String> questions) throws Exception {
		
		Expert expert = expertRepository.findByUser_Username(username).get();
		
		expert.setQuestionAnswer1(questions.get(0));
		expert.setQuestionAnswer2(questions.get(1));
		expert.setQuestionAnswer3(questions.get(2));
		
		expertRepository.save(expert);
		
	}


}
