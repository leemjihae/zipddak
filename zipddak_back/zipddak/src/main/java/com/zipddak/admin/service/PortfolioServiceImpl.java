package com.zipddak.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.ExpertPortfolioDto;
import com.zipddak.admin.repository.PortfolioDslRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {
	
	private final PortfolioDslRepository portFolioDslRepository;
	
	@Override
	public List<ExpertPortfolioDto> expertPortfolio(Integer expertIdx) throws Exception {

		return portFolioDslRepository.expertPortfolio(expertIdx);
	}

}
