package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.EstimatePaymentExpertDto;
import com.zipddak.admin.dto.ExpertCardDto;
import com.zipddak.admin.dto.ExpertProfileDto;

public interface ExpertFindService {

	List<ExpertCardDto> addExperts(Integer cateNo)throws Exception;

	List<ExpertCardDto> experts(Integer page, Integer categoryNo, String keyword, String sort)throws Exception;

	ExpertProfileDto expertProfile(Integer expertIdx) throws Exception;

	EstimatePaymentExpertDto expertDetail(Integer estimateIdx) throws Exception;

	boolean mainServiceCheck(String username) throws Exception;

	void modifyQuestion(String username, List<String> questions) throws Exception;

}
