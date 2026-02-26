package com.zipddak.admin.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.EstimatePaymentRequestDetailDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QRequest;

@Repository
public class RequestDetailDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public EstimatePaymentRequestDetailDto findByEstimateIdx(Integer estimateIdx) {
		
		QRequest request = QRequest.request;
		QCategory cate1 = new QCategory("cate1");
		QCategory cate2 = new QCategory("cate2");
		QCategory cate3 = new QCategory("cate3");
		QEstimate estimate = QEstimate.estimate;
		
		return jpaQueryFactory.select(Projections.bean(EstimatePaymentRequestDetailDto.class,
						request.requestIdx,
						cate1.name.as("cateName1"),
						cate2.name.as("cateName2"),
						cate3.name.as("cateName3"),
						request.preferredDate,
						request.budget,
						request.location,
						request.additionalRequest
				))
				.from(request)
				.leftJoin(cate1).on(request.largeServiceIdx.eq(cate1.categoryIdx))
				.leftJoin(cate2).on(request.midServiceIdx.eq(cate2.categoryIdx))
				.leftJoin(cate3).on(request.smallServiceIdx.eq(cate3.categoryIdx))
				.leftJoin(estimate).on(request.requestIdx.eq(estimate.requestIdx))
				.where(estimate.estimateIdx.eq(estimateIdx))
				.fetchOne();
	}

}
