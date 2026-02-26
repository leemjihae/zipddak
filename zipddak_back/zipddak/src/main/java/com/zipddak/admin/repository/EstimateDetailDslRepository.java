package com.zipddak.admin.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.EstimatePaymentCostDto;
import com.zipddak.dto.EstimateCostDto;
import com.zipddak.entity.EstimateCost.CostType;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QEstimateCost;

@Repository
public class EstimateDetailDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public EstimatePaymentCostDto largeCost(Integer estimateIdx) {

		QEstimate estimate = QEstimate.estimate;
		
		return jpaQueryFactory.select(Projections.bean(EstimatePaymentCostDto.class, 
					estimate.workDurationType,
					estimate.workDurationValue,
					estimate.largeServiceIdx,
					estimate.disposalCost,
					estimate.demolitionCost,
					estimate.consultingLaborCost,
					estimate.stylingDesignCost,
					estimate.threeDImageCost,
					estimate.reportProductionCost,
					estimate.etcFee,
					estimate.costDetail
				))
				.from(estimate)
				.where(estimate.estimateIdx.eq(estimateIdx))
				.fetchOne();
	}

	public List<EstimateCostDto> buildCost(Integer estimateIdx) {

		QEstimateCost cost = QEstimateCost.estimateCost;
		
		return jpaQueryFactory.select(Projections.bean(EstimateCostDto.class, 
					cost.costIdx,
					cost.label,
					cost.amount
				))
				.from(cost)
				.where(cost.estimateIdx.eq(estimateIdx).and(cost.type.eq(CostType.BUILD)))
				.fetch();
				
	}

	public List<EstimateCostDto> materialCost(Integer estimateIdx) {

		QEstimateCost cost = QEstimateCost.estimateCost;
		
		return jpaQueryFactory.select(Projections.bean(EstimateCostDto.class, 
					cost.costIdx,
					cost.label,
					cost.amount
				))
				.from(cost)
				.where(cost.estimateIdx.eq(estimateIdx).and(cost.type.eq(CostType.MATERIAL)))
				.fetch();
		
	}
	
}
