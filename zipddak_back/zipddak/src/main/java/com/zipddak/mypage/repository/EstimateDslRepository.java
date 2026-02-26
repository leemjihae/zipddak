package com.zipddak.mypage.repository;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Career;
import com.zipddak.entity.QCareer;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QEstimateCost;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QFavoritesExpert;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QRequest;
import com.zipddak.entity.QReviewExpert;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.EstimateWriteDto.EstimateCostListDto;
import com.zipddak.mypage.dto.FavoriteExpertDto;
import com.zipddak.mypage.dto.SentEstimateDetailDto;
import com.zipddak.mypage.dto.SentEstimateListDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EstimateDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// [전문가]보낸 견적서 목록 - 진행중인 견적 요청
	public List<SentEstimateListDto> selectProgressSentEstimateList(Integer expertIdx, PageRequest pageRequest)
			throws Exception {

		QEstimate estimate = QEstimate.estimate;
		QRequest request = QRequest.request;
		QEstimateCost estimateCost = QEstimateCost.estimateCost;
		QCategory category = QCategory.category;

		return jpaQueryFactory
				.select(Projections.constructor(SentEstimateListDto.class, estimate.estimateIdx, estimate.createdAt,
						estimateCost.amount.sum().coalesce(0).add(estimate.disposalCost.coalesce(0))
								.add(estimate.demolitionCost.coalesce(0)).add(estimate.etcFee.coalesce(0))
								.add(estimate.consultingLaborCost.coalesce(0))
								.add(estimate.stylingDesignCost.coalesce(0)).add(estimate.threeDImageCost.coalesce(0))
								.add(estimate.reportProductionCost.coalesce(0)),
						category.name, request.location, request.budget, request.preferredDate))
				.from(estimate).join(request).on(request.requestIdx.eq(estimate.requestIdx)).leftJoin(estimateCost)
				.on(estimateCost.estimateIdx.eq(estimate.estimateIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(request.smallServiceIdx))
				.where(estimate.expert.expertIdx.eq(expertIdx).and(request.status.eq("RECRUITING")))
				.groupBy(estimate.estimateIdx, estimate.createdAt, request.status, estimate.largeServiceIdx,
						request.location, request.budget, request.preferredDate, estimate.disposalCost,
						estimate.demolitionCost, estimate.etcFee, estimate.consultingLaborCost,
						estimate.stylingDesignCost, estimate.threeDImageCost, estimate.reportProductionCost)
				.orderBy(estimate.createdAt.desc()).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize())
				.fetch();
	}

	// [전문가]보낸 견적서 개수 - 진행중인 견적 요청
	public Long selectProgressSentEstimateCount(Integer expertIdx) throws Exception {
		QEstimate estimate = QEstimate.estimate;
		QRequest request = QRequest.request;

		return jpaQueryFactory.select(estimate.count()).from(estimate).join(request)
				.on(request.requestIdx.eq(estimate.requestIdx))
				.where(estimate.expert.expertIdx.eq(expertIdx).and(request.status.eq("RECRUITING"))).fetchOne();
	}

	// [전문가]보낸 견적서 목록 - 종료된 견적 요청
	public List<SentEstimateListDto> selectFinishSentEstimateList(Integer expertIdx, PageRequest pageRequest)
			throws Exception {

		QEstimate estimate = QEstimate.estimate;
		QRequest request = QRequest.request;
		QEstimateCost estimateCost = QEstimateCost.estimateCost;
		QCategory category = QCategory.category;

		return jpaQueryFactory
				.select(Projections.constructor(SentEstimateListDto.class, estimate.estimateIdx, estimate.createdAt,
						estimateCost.amount.sum().coalesce(0).add(estimate.disposalCost.coalesce(0))
								.add(estimate.demolitionCost.coalesce(0)).add(estimate.etcFee.coalesce(0))
								.add(estimate.consultingLaborCost.coalesce(0))
								.add(estimate.stylingDesignCost.coalesce(0)).add(estimate.threeDImageCost.coalesce(0))
								.add(estimate.reportProductionCost.coalesce(0)),
						category.name, request.location, request.budget, request.preferredDate))
				.from(estimate).join(request).on(request.requestIdx.eq(estimate.requestIdx)).leftJoin(estimateCost)
				.on(estimateCost.estimateIdx.eq(estimate.estimateIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(request.smallServiceIdx))
				.where(estimate.expert.expertIdx.eq(expertIdx).and(request.status.ne("RECRUITING")))
				.groupBy(estimate.estimateIdx, estimate.createdAt, request.status, estimate.largeServiceIdx,
						request.location, request.budget, request.preferredDate, estimate.disposalCost,
						estimate.demolitionCost, estimate.etcFee, estimate.consultingLaborCost,
						estimate.stylingDesignCost, estimate.threeDImageCost, estimate.reportProductionCost)
				.orderBy(estimate.createdAt.desc()).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize())
				.fetch();
	}

	// [전문가]보낸 견적서 개수 - 종료된 견적 요청
	public Long selectFinishSentEstimateCount(Integer expertIdx) throws Exception {
		QEstimate estimate = QEstimate.estimate;
		QRequest request = QRequest.request;

		return jpaQueryFactory.select(estimate.count()).from(estimate).join(request)
				.on(request.requestIdx.eq(estimate.requestIdx))
				.where(estimate.expert.expertIdx.eq(expertIdx).and(request.status.ne("RECRUITING"))).fetchOne();
	}

	// [전문가]보낸 견적서 상세 조회
	public SentEstimateDetailDto selectSentEstimateDetail(Integer estimateIdx) throws Exception {
		QEstimate estimate = QEstimate.estimate;
		QRequest request = QRequest.request;
		QCategory category1 = new QCategory("category1");
		QCategory category2 = new QCategory("category2");
		QCategory category3 = new QCategory("category3");
		QUser user = QUser.user;
		QExpertFile expertFile1 = new QExpertFile("expertFile1");
		QExpertFile expertFile2 = new QExpertFile("expertFile2");
		QExpertFile expertFile3 = new QExpertFile("expertFile3");

		return jpaQueryFactory
				.select(Projections.constructor(SentEstimateDetailDto.class, estimate.estimateIdx,
						estimate.workDurationType, estimate.workDurationValue, estimate.workScope, estimate.workDetail,
						estimate.disposalCost, estimate.demolitionCost, estimate.etcFee, estimate.costDetail,
						estimate.diagnosisType, estimate.repairType, estimate.demolitionType, estimate.consultingType,
						estimate.consultingLaborCost, estimate.stylingDesignCost, estimate.threeDImageCost,
						estimate.reportProductionCost, request.requestIdx, request.createdAt, request.largeServiceIdx,
						category1.name, category2.name, category3.name, user.name, user.phone, user.zonecode,
						user.addr1, user.addr2, request.budget, request.preferredDate, request.location,
						request.constructionSize, request.purpose, request.place, request.additionalRequest,
						request.status, expertFile1.fileRename, expertFile2.fileRename, expertFile3.fileRename))
				.from(estimate).leftJoin(request).on(request.requestIdx.eq(estimate.requestIdx)).leftJoin(category1)
				.on(request.largeServiceIdx.eq(category1.categoryIdx)).leftJoin(category2)
				.on(request.midServiceIdx.eq(category2.categoryIdx)).leftJoin(category3)
				.on(request.smallServiceIdx.eq(category3.categoryIdx)).leftJoin(user)
				.on(user.username.eq(request.userUsername)).leftJoin(expertFile1)
				.on(expertFile1.expertFileIdx.eq(request.image1Idx)).leftJoin(expertFile2)
				.on(expertFile2.expertFileIdx.eq(request.image2Idx)).leftJoin(expertFile3)
				.on(expertFile3.expertFileIdx.eq(request.image3Idx)).where(estimate.estimateIdx.eq(estimateIdx))
				.fetchOne();
	}

	// [전문가]보낸 견적서 상세 조회 - 견적 금액
	public List<EstimateCostListDto> selectEstimateCostList(Integer estimateIdx) throws Exception {
		QEstimateCost estimateCost = QEstimateCost.estimateCost;

		return jpaQueryFactory
				.select(Projections.constructor(EstimateCostListDto.class, estimateCost.type, estimateCost.label,
						estimateCost.amount))
				.from(estimateCost).where(estimateCost.estimateIdx.eq(estimateIdx)).fetch();
	}

	// 전문가 프로필 조회
	public FavoriteExpertDto selectExpertCard(Integer expertIdx) throws Exception {

		QExpert expert = QExpert.expert;
		QExpertFile expertFile = QExpertFile.expertFile;
		QCategory category = QCategory.category;
		QReviewExpert reviewExpert = QReviewExpert.reviewExpert;
		QMatching matching = QMatching.matching;
		QCareer career = QCareer.career;

		FavoriteExpertDto result = jpaQueryFactory
				.select(Projections.constructor(FavoriteExpertDto.class, expert.expertIdx, expert.activityName,
						expertFile.fileRename, category.name, expert.addr1, Expressions.constant(0), matching.count(),
						reviewExpert.score.avg().coalesce(0.0).intValue(), reviewExpert.count()))
				.from(expert).leftJoin(expertFile).on(expertFile.expertFileIdx.eq(expert.profileImageIdx))
				.leftJoin(category).on(category.categoryIdx.eq(expert.mainServiceIdx)).leftJoin(reviewExpert)
				.on(reviewExpert.expertIdx.eq(expert.expertIdx)).leftJoin(matching)
				.on(matching.expertIdx.eq(expert.expertIdx)).leftJoin(career).on(career.expertIdx.eq(expert.expertIdx))
				.where(expert.expertIdx.eq(expertIdx))
				.groupBy(expert.expertIdx, expert.activityName, expertFile.fileRename, category.name).fetchOne();

		// 2) 전문가별 career 조회 + Java로 경력 계산
		List<Career> careers = jpaQueryFactory.selectFrom(career).where(career.expertIdx.eq(expertIdx)).fetch();

		result.setCareerCount(calculateCareerMonths(careers));

		return result;
	}

	private int calculateCareerMonths(List<Career> careers) {
		int totalMonths = 0;

		for (Career c : careers) {
			if (c.getStartDate() != null && c.getEndDate() != null) {
				LocalDate start = c.getStartDate().toLocalDate();
				LocalDate end = c.getEndDate().toLocalDate();

				Period p = Period.between(start, end);
				totalMonths += p.getYears() * 12 + p.getMonths();
			}
		}

		return totalMonths;
	}

}
