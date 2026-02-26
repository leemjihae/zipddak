package com.zipddak.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.EstimatePaymentCostDto;
import com.zipddak.admin.repository.EstimateDetailDslRepository;
import com.zipddak.dto.EstimateCostDto;
import com.zipddak.entity.Estimate;
import com.zipddak.entity.Request;
import com.zipddak.repository.EstimateRepository;
import com.zipddak.repository.RequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstimateDetailServiceImpl implements EstimateDetailService{

	private final EstimateRepository estimateRepository;
	private final RequestRepository requestRepository;
	private final EstimateDetailDslRepository estimateDetailDslRepository; 
	
	@Override
	public boolean estimateCheck(Integer estimateIdx, String username) throws Exception {

		Estimate estimate = estimateRepository.findById(estimateIdx).orElseThrow(() -> new Exception("견적서 확인 중 오류"));
		
		Request request = requestRepository.findById(estimate.getRequestIdx()).orElseThrow(() -> new Exception("요청서 확인 중 오류"));
		
		return request.getUserUsername().equals(username) ? true : false;
	}

	@Override
	public EstimatePaymentCostDto detail(Integer estimateIdx) throws Exception {

		// 작업 비용 계산
		EstimatePaymentCostDto largeCostDto = estimateDetailDslRepository.largeCost(estimateIdx);
		
		int consConstSum = 0;
		consConstSum += largeCostDto.getConsultingLaborCost()
					+ largeCostDto.getStylingDesignCost()
					+ largeCostDto.getThreeDImageCost()
					+ largeCostDto.getReportProductionCost()
					+ largeCostDto.getEtcFee();
		
		
		
		List<EstimateCostDto> buildCost = estimateDetailDslRepository.buildCost(estimateIdx);
		
		List<EstimateCostDto> materialCost = estimateDetailDslRepository.materialCost(estimateIdx);
		
		int buildSum = 0;
		int materialSum = 0;
		
		for(EstimateCostDto build : buildCost) {
			buildSum += build.getAmount();
		}
		
		for(EstimateCostDto material : materialCost) {
			materialSum += material.getAmount();
		}
		
		largeCostDto.setConsCostSum(consConstSum);
		largeCostDto.setBuildCostList(buildCost);
		largeCostDto.setMaterialCostList(materialCost);
		largeCostDto.setBuildCostSum(buildSum);
		largeCostDto.setMaterialCostSum(materialSum);
		
		return largeCostDto;
	}

}

