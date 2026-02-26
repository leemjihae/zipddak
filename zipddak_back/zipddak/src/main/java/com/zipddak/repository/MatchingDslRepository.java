package com.zipddak.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Matching.MatchingStatus;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QEstimateCost;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QRequest;
import com.zipddak.entity.QReviewExpert;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.MatchingListDto;
import com.zipddak.mypage.dto.MatchingStatusSummaryDto;
import com.zipddak.mypage.dto.UserMatchingDetailDto;
import com.zipddak.mypage.dto.EstimateWriteDto.EstimateCostListDto;
import com.zipddak.mypage.dto.ExpertMatchingDetailDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MatchingDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// [전문가]매칭 목록 조회
	public List<MatchingListDto> selectExpertMatchingList(Integer expertIdx, MatchingStatus status,
			PageRequest pageRequest, Date startDate, Date endDate) throws Exception {
		QMatching matching = QMatching.matching;
		QRequest request = QRequest.request;
		QExpert expert = QExpert.expert;
		QUser user = QUser.user;
		QCategory category = QCategory.category;
		QPayment payment = QPayment.payment;

		BooleanBuilder builder = new BooleanBuilder();

		// 전문가 아이디 조건
		builder.and(matching.expertIdx.eq(expertIdx));

		// 날짜 조건
		if (startDate != null) {
			builder.and(matching.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(matching.createdAt.loe(endDate));
		}

		// 상태 조건
		if (status != null) {
			builder.and(matching.status.eq(status));
		}

		return jpaQueryFactory
				.select(Projections.constructor(MatchingListDto.class, matching.matchingIdx, matching.matchingCode,
						matching.createdAt, matching.workStartDate, matching.workEndDate, matching.status,
						payment.totalAmount, user.name, expert.activityName, request.largeServiceIdx, category.name,
						request.location, request.budget, request.preferredDate))
				.from(matching).leftJoin(request).on(request.requestIdx.eq(matching.requestIdx)).leftJoin(expert)
				.on(expert.expertIdx.eq(matching.expertIdx)).leftJoin(user).on(user.username.eq(matching.userUsername))
				.leftJoin(category).on(category.categoryIdx.eq(request.smallServiceIdx)).leftJoin(payment)
				.on(payment.paymentIdx.eq(matching.paymentIdx)).where(builder).offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize()).fetch();
	}

	// [전문가]매칭 목록 개수
	public Long selectExpertMatchingCount(Integer expertIdx, MatchingStatus status, Date startDate, Date endDate)
			throws Exception {
		QMatching matching = QMatching.matching;

		BooleanBuilder builder = new BooleanBuilder();

		// 전문가 아이디 조건
		builder.and(matching.expertIdx.eq(expertIdx));

		// 날짜 조건
		if (startDate != null) {
			builder.and(matching.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(matching.createdAt.loe(endDate));
		}

		// 상태 조건
		if (status != null) {
			builder.and(matching.status.eq(status));
		}

		return jpaQueryFactory.select(matching.count()).from(matching).where(builder).fetchOne();
	}

	// [전문가]매칭 상세 조회
	public ExpertMatchingDetailDto selectExpertMatchingDetail(Integer matchingIdx) throws Exception {
		QMatching matching = QMatching.matching;
		QPayment payment = QPayment.payment;
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
				.select(Projections.constructor(ExpertMatchingDetailDto.class, matching.matchingIdx,
						matching.matchingCode, payment.totalAmount, matching.workStartDate, matching.workEndDate,
						matching.status, matching.createdAt, estimate.estimateIdx, estimate.workDurationType,
						estimate.workDurationValue, estimate.workScope, estimate.workDetail, estimate.disposalCost,
						estimate.demolitionCost, estimate.etcFee, estimate.costDetail, estimate.diagnosisType,
						estimate.repairType, estimate.demolitionType, estimate.consultingType,
						estimate.consultingLaborCost, estimate.stylingDesignCost, estimate.threeDImageCost,
						estimate.reportProductionCost, request.requestIdx, request.createdAt, category1.name,
						category2.name, category3.name, user.name, user.phone, user.zonecode, user.addr1, user.addr2,
						request.budget, request.preferredDate, request.location, request.constructionSize,
						request.purpose, request.place, request.additionalRequest, request.status,
						expertFile1.fileRename, expertFile2.fileRename, expertFile3.fileRename))
				.from(matching).leftJoin(estimate).on(estimate.estimateIdx.eq(matching.estimateIdx)).leftJoin(request)
				.on(request.requestIdx.eq(estimate.requestIdx)).leftJoin(payment)
				.on(payment.paymentIdx.eq(matching.paymentIdx)).leftJoin(category1)
				.on(request.largeServiceIdx.eq(category1.categoryIdx)).leftJoin(category2)
				.on(request.midServiceIdx.eq(category2.categoryIdx)).leftJoin(category3)
				.on(request.smallServiceIdx.eq(category3.categoryIdx)).leftJoin(user)
				.on(user.username.eq(request.userUsername)).leftJoin(expertFile1)
				.on(expertFile1.expertFileIdx.eq(request.image1Idx)).leftJoin(expertFile2)
				.on(expertFile2.expertFileIdx.eq(request.image2Idx)).leftJoin(expertFile3)
				.on(expertFile3.expertFileIdx.eq(request.image3Idx)).where(matching.matchingIdx.eq(matchingIdx))
				.fetchOne();
	}

	// 매칭 상세 조회 - 견적 금액
	public List<EstimateCostListDto> selectExpertMatchingCostList(Integer matchingIdx) throws Exception {
		QMatching matching = QMatching.matching;
		QEstimateCost estimateCost = QEstimateCost.estimateCost;

		return jpaQueryFactory
				.select(Projections.constructor(EstimateCostListDto.class, estimateCost.type, estimateCost.label,
						estimateCost.amount))
				.from(matching).leftJoin(estimateCost).on(estimateCost.estimateIdx.eq(matching.estimateIdx))
				.where(matching.matchingIdx.eq(matchingIdx)).fetch();
	}

	// [전문가]매칭현황 요약
	public MatchingStatusSummaryDto selectMatchingStatusSummary(Integer expertIdx) throws Exception {
		QMatching matching = QMatching.matching;

		return jpaQueryFactory
				.select(Projections.constructor(MatchingStatusSummaryDto.class,
						matching.status.when(MatchingStatus.PAYMENT_COMPLETED).then(1).otherwise(0).sum(),
						matching.status.when(MatchingStatus.IN_PROGRESS).then(1).otherwise(0).sum(),
						matching.status.when(MatchingStatus.COMPLETED).then(1).otherwise(0).sum(),
						matching.status.when(MatchingStatus.CANCELLED).then(1).otherwise(0).sum()))
				.from(matching).where(matching.expertIdx.eq(expertIdx)).fetchOne();
	}

	// [일반사용자]매칭 목록 조회
	public List<MatchingListDto> selectUserMatchingList(String username, PageRequest pageRequest, Date startDate,
			Date endDate) throws Exception {
		QMatching matching = QMatching.matching;
		QRequest request = QRequest.request;
		QExpert expert = QExpert.expert;
		QExpertFile file = QExpertFile.expertFile;
		QUser user = QUser.user;
		QCategory category = QCategory.category;
		QPayment payment = QPayment.payment;
		
		QReviewExpert review = QReviewExpert.reviewExpert;

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 아이디 조건
		builder.and(matching.userUsername.eq(username));
		
		// 결제 취소된건 제외
		builder.and(matching.status.ne(MatchingStatus.PAYMENT_CANCELLED));
		
		// 날짜 조건
		if (startDate != null) {
			builder.and(matching.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(matching.createdAt.loe(endDate));
		}

		return jpaQueryFactory
				.select(Projections.constructor(MatchingListDto.class, matching.matchingIdx, matching.matchingCode,
						matching.createdAt, matching.workStartDate, matching.workEndDate, matching.status,
						payment.totalAmount, user.name, expert.activityName, request.largeServiceIdx, category.name,
						request.location, request.budget, request.preferredDate, expert.expertIdx, file.fileRename.as("expertThumbnail"),
						review.reviewExpertIdx.isNotNull()))
				.from(matching).leftJoin(request).on(request.requestIdx.eq(matching.requestIdx)).leftJoin(expert)
				.on(expert.expertIdx.eq(matching.expertIdx)).leftJoin(user).on(user.username.eq(matching.userUsername))
				.leftJoin(category).on(category.categoryIdx.eq(request.smallServiceIdx)).leftJoin(payment)
				.on(payment.paymentIdx.eq(matching.paymentIdx))
				.leftJoin(file).on(file.expertFileIdx.eq(expert.profileImageIdx))
				.leftJoin(review).on(review.matchingIdx.eq(matching.matchingIdx))
				.where(builder).offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize()).fetch();
	}

	// [일반사용자]매칭 목록 개수
	public Long selectUserMatchingCount(String username, Date startDate, Date endDate) throws Exception {
		QMatching matching = QMatching.matching;

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 아이디 조건
		builder.and(matching.userUsername.eq(username));

		// 날짜 조건
		if (startDate != null) {
			builder.and(matching.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(matching.createdAt.loe(endDate));
		}

		return jpaQueryFactory.select(matching.count()).from(matching).where(builder).fetchOne();
	}

	// [일반사용자]매칭 상세 조회
	public UserMatchingDetailDto selectUserMatchingDetail(Integer matchingIdx) throws Exception {
		QMatching matching = QMatching.matching;
		QPayment payment = QPayment.payment;
		QEstimate estimate = QEstimate.estimate;
		QRequest request = QRequest.request;
		QCategory category1 = new QCategory("category1");
		QCategory category2 = new QCategory("category2");
		QCategory category3 = new QCategory("category3");
		QExpertFile expertFile1 = new QExpertFile("expertFile1");
		QExpertFile expertFile2 = new QExpertFile("expertFile2");
		QExpertFile expertFile3 = new QExpertFile("expertFile3");

		return jpaQueryFactory
				.select(Projections.constructor(UserMatchingDetailDto.class, matching.matchingIdx,
						matching.matchingCode, payment.totalAmount, payment.method, matching.workStartDate,
						matching.workEndDate, matching.status, matching.createdAt, estimate.estimateIdx,
						estimate.workDurationType, estimate.workDurationValue, estimate.workScope, estimate.workDetail,
						estimate.disposalCost, estimate.demolitionCost, estimate.etcFee, estimate.costDetail,
						estimate.diagnosisType, estimate.repairType, estimate.demolitionType, estimate.consultingType,
						estimate.consultingLaborCost, estimate.stylingDesignCost, estimate.threeDImageCost,
						estimate.reportProductionCost, request.requestIdx, request.createdAt, category1.name,
						category2.name, category3.name, request.budget, request.preferredDate, request.location,
						request.constructionSize, request.purpose, request.place, request.additionalRequest,
						request.status, expertFile1.fileRename, expertFile2.fileRename, expertFile3.fileRename))
				.from(matching).leftJoin(estimate).on(estimate.estimateIdx.eq(matching.estimateIdx)).leftJoin(request)
				.on(request.requestIdx.eq(estimate.requestIdx)).leftJoin(payment)
				.on(payment.paymentIdx.eq(matching.paymentIdx)).leftJoin(category1)
				.on(request.largeServiceIdx.eq(category1.categoryIdx)).leftJoin(category2)
				.on(request.midServiceIdx.eq(category2.categoryIdx)).leftJoin(category3)
				.on(request.smallServiceIdx.eq(category3.categoryIdx)).leftJoin(expertFile1)
				.on(expertFile1.expertFileIdx.eq(request.image1Idx)).leftJoin(expertFile2)
				.on(expertFile2.expertFileIdx.eq(request.image2Idx)).leftJoin(expertFile3)
				.on(expertFile3.expertFileIdx.eq(request.image3Idx)).where(matching.matchingIdx.eq(matchingIdx))
				.fetchOne();
	}

}
