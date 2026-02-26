package com.zipddak.mypage.service;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.CareerDto;
import com.zipddak.dto.ExpertDto;
import com.zipddak.dto.PortfolioDto;
import com.zipddak.mypage.dto.ExpertProfileDto;
import com.zipddak.mypage.dto.ExpertSettleDto;

public interface ExpertProfileService {
	ExpertProfileDto getExpertProfileDetail(String username) throws Exception;

	void modifyExpertProfile(ExpertDto expertDto, MultipartFile profileImage, MultipartFile businessImage,
			MultipartFile[] certificateImages) throws Exception;

	String addPortfolio(PortfolioDto portfolioDto, MultipartFile[] portfolioImages) throws Exception;

	void deletePortfolio(Integer portfolioIdx) throws Exception;

	void addCareer(CareerDto careerDto) throws Exception;

	void deleteCareer(Integer careerIdx) throws Exception;

	ExpertSettleDto getExpertSettleDetail(String username) throws Exception;

	void modifyExpertSettle(String username, ExpertSettleDto expertSettleDto) throws Exception;

	void toggleActivityStatus(String username) throws Exception;
}
