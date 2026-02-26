package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.ExpertPortfolioDto;

public interface PortfolioService {

	List<ExpertPortfolioDto> expertPortfolio(Integer expertIdx) throws Exception;

}
