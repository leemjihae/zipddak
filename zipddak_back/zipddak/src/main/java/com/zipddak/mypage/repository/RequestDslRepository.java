package com.zipddak.mypage.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QEstimateCost;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QProfileFile;
import com.zipddak.entity.QRequest;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.PublicRequestDetailDto;
import com.zipddak.mypage.dto.PublicRequestListDto;
import com.zipddak.mypage.dto.ReceiveRequestDetailDto;
import com.zipddak.mypage.dto.ReceiveRequestListDto;
import com.zipddak.mypage.dto.RequestActiveDetailDto;
import com.zipddak.mypage.dto.RequestActiveExpertListDto;
import com.zipddak.mypage.dto.RequestHistoryListDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RequestDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 공개 요청서 목록 조회
	public List<PublicRequestListDto> selectPublicRequestList(Long lastId, int size) throws Exception {
		QRequest request = QRequest.request;
		QUser user = QUser.user;
		QEstimate estimate = QEstimate.estimate;
		QCategory category = QCategory.category;
		QProfileFile profileFile = QProfileFile.profileFile;

		return jpaQueryFactory
				.select(Projections.constructor(PublicRequestListDto.class, request.requestIdx, request.createdAt,
						user.name, profileFile.fileRename, estimate.count(), category.name, request.location,
						request.budget, request.preferredDate))
				.from(request).leftJoin(estimate).on(estimate.requestIdx.eq(request.requestIdx)).leftJoin(category)
				.on(request.largeServiceIdx.eq(74).and(category.categoryIdx.eq(request.largeServiceIdx))
						.or(request.largeServiceIdx.ne(74).and(category.categoryIdx.eq(request.smallServiceIdx))))
				.leftJoin(user).on(user.username.eq(request.userUsername)).leftJoin(profileFile)
				.on(profileFile.profileFileIdx.eq(user.profileImg))
				.where(request.status.eq("RECRUITING"),
						lastId != null && lastId > 0 ? request.requestIdx.lt(lastId) : null)
				.groupBy(request.requestIdx, request.createdAt, user.name, category.name, request.location,
						request.budget, request.preferredDate)
				.orderBy(request.requestIdx.desc()).limit(size).fetch();
	}

	// 공개 요청서 상세 조회
	public PublicRequestDetailDto selectPublicRequestDetail(Integer requestIdx) throws Exception {
		QRequest request = QRequest.request;
		QUser user = QUser.user;
		QEstimate estimate = QEstimate.estimate;
		QMatching matching = QMatching.matching;
		QCategory category = QCategory.category;
		QProfileFile profileFile = QProfileFile.profileFile;
		QExpertFile expertFile1 = new QExpertFile("expertFile1");
		QExpertFile expertFile2 = new QExpertFile("expertFile2");
		QExpertFile expertFile3 = new QExpertFile("expertFile3");

		return jpaQueryFactory
				.select(Projections.constructor(PublicRequestDetailDto.class, request.requestIdx, request.createdAt,
						estimate.count(), user.name, profileFile.fileRename, matching.count(), request.largeServiceIdx,
						request.midServiceIdx, request.smallServiceIdx, category.name, request.location, request.budget,
						request.preferredDate, request.constructionSize, request.additionalRequest,
						expertFile1.fileRename, expertFile2.fileRename, expertFile3.fileRename, request.purpose,
						request.place))
				.from(request).leftJoin(estimate).on(estimate.requestIdx.eq(request.requestIdx)).leftJoin(user)
				.on(user.username.eq(request.userUsername)).leftJoin(matching)
				.on(matching.userUsername.eq(user.username)).leftJoin(category)
				.on(request.largeServiceIdx.eq(74).and(category.categoryIdx.eq(request.largeServiceIdx))
						.or(request.largeServiceIdx.ne(74).and(category.categoryIdx.eq(request.smallServiceIdx))))
				.leftJoin(expertFile1).on(expertFile1.expertFileIdx.eq(request.image1Idx)).leftJoin(expertFile2)
				.on(expertFile2.expertFileIdx.eq(request.image2Idx)).leftJoin(expertFile3)
				.on(expertFile3.expertFileIdx.eq(request.image3Idx)).leftJoin(profileFile)
				.on(profileFile.profileFileIdx.eq(user.profileImg)).where(request.requestIdx.eq(requestIdx))
				.groupBy(request.requestIdx, request.createdAt, user.name, profileFile.fileRename, category.name,
						request.location, request.budget, request.preferredDate, request.constructionSize,
						request.additionalRequest, expertFile1.fileRename, expertFile2.fileRename,
						expertFile3.fileRename, request.purpose, request.place)

				.fetchOne();
	}

	// [전문가]받은 요청서 목록
	public List<ReceiveRequestListDto> selectReceiveRequestList(Integer expertIdx, PageRequest pageRequest)
			throws Exception {
		QRequest request = QRequest.request;
		QCategory category = QCategory.category;

		return jpaQueryFactory
				.select(Projections.constructor(ReceiveRequestListDto.class, request.requestIdx, request.createdAt,
						category.name, request.location, request.budget, request.preferredDate))
				.from(request).leftJoin(category).on(category.categoryIdx.eq(request.smallServiceIdx))
				.where(request.expertIdx.eq(expertIdx).and(request.status.eq("RECRUITING")))
				.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();
	}

	// [전문가]받은 요청서 개수
	public Long selectReceiveRequestCount(Integer expertIdx) throws Exception {
		QRequest request = QRequest.request;

		return jpaQueryFactory.select(request.count()).from(request)
				.where(request.expertIdx.eq(expertIdx).and(request.status.eq("RECRUITING"))).fetchOne();
	}

	// [전문가]받은 요청서 상세
	public ReceiveRequestDetailDto selectReceiveRequestDetail(Integer requestIdx) throws Exception {
		QRequest request = QRequest.request;
		QUser user = QUser.user;
		QCategory category = QCategory.category;
		QExpertFile expertFile1 = new QExpertFile("expertFile1");
		QExpertFile expertFile2 = new QExpertFile("expertFile2");
		QExpertFile expertFile3 = new QExpertFile("expertFile3");

		return jpaQueryFactory
				.select(Projections.constructor(ReceiveRequestDetailDto.class, request.requestIdx, request.createdAt,
						user.name, user.phone, request.largeServiceIdx, category.name, request.location, request.budget,
						request.preferredDate, request.constructionSize, request.additionalRequest, request.purpose,
						request.place, expertFile1.fileRename, expertFile2.fileRename, expertFile3.fileRename))
				.from(request).leftJoin(user).on(user.username.eq(request.userUsername)).leftJoin(category)
				.on(category.categoryIdx.eq(request.smallServiceIdx)).leftJoin(expertFile1)
				.on(expertFile1.expertFileIdx.eq(request.image1Idx)).leftJoin(expertFile2)
				.on(expertFile2.expertFileIdx.eq(request.image2Idx)).leftJoin(expertFile3)
				.on(expertFile3.expertFileIdx.eq(request.image3Idx)).where(request.requestIdx.eq(requestIdx))
				.fetchOne();
	}

	// [일반사용자]지난 요청서 목록
	public List<RequestHistoryListDto> selectRequestHistoryList(String username, String status, PageRequest pageRequest)
			throws Exception {
		QRequest request = QRequest.request;
		QCategory category = QCategory.category;
		QMatching matching = QMatching.matching;

		List<RequestHistoryListDto> requestHistoryListDto = new ArrayList<>();

		if (status.equals("전체")) {
			requestHistoryListDto = jpaQueryFactory
					.select(Projections.constructor(RequestHistoryListDto.class, request.requestIdx, request.createdAt,
							request.status,
							new CaseBuilder()
									.when(JPAExpressions.selectOne().from(matching)
											.where(matching.requestIdx.eq(request.requestIdx)).exists())
									.then(true).otherwise(false),
							category.name, request.location, request.budget, request.preferredDate))
					.from(request).leftJoin(category).on(category.categoryIdx.eq(request.smallServiceIdx))
					.where(request.userUsername.eq(username)).offset(pageRequest.getOffset())
					.limit(pageRequest.getPageSize()).fetch();
		} else if (status.equals("매칭완료")) {
			requestHistoryListDto = jpaQueryFactory
					.select(Projections.constructor(RequestHistoryListDto.class, request.requestIdx, request.createdAt,
							request.status, Expressions.constant(true), category.name, request.location, request.budget,
							request.preferredDate))
					.from(request).leftJoin(category).on(category.categoryIdx.eq(request.smallServiceIdx))
					.where(request.userUsername.eq(username), JPAExpressions.selectOne().from(matching)
							.where(matching.requestIdx.eq(request.requestIdx)).exists())
					.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();
		} else if (status.equals("매칭실패")) {
			requestHistoryListDto = jpaQueryFactory
					.select(Projections.constructor(RequestHistoryListDto.class, request.requestIdx, request.createdAt,
							request.status, Expressions.constant(false), category.name, request.location,
							request.budget, request.preferredDate))
					.from(request).leftJoin(category).on(category.categoryIdx.eq(request.smallServiceIdx))
					.where(request.userUsername.eq(username), request.status.in("RECRUITED", "STOPPED"),
							JPAExpressions.selectOne().from(matching).where(matching.requestIdx.eq(request.requestIdx))
									.notExists())
					.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();
		}

		return requestHistoryListDto;

	}

	// [일반사용자]지난 요청서 개수
	public Long selectRequestHistoryCount(String username, String status) throws Exception {
		QRequest request = QRequest.request;
		QMatching matching = QMatching.matching;

		Long cnt = 0L;

		if (status.equals("전체")) {
			cnt = jpaQueryFactory.select(request.count()).from(request).where(request.userUsername.eq(username))
					.fetchOne();
		} else if (status.equals("매칭완료")) {
			cnt = jpaQueryFactory
					.select(request.count()).from(request).where(request.userUsername.eq(username), JPAExpressions
							.selectOne().from(matching).where(matching.requestIdx.eq(request.requestIdx)).exists())
					.fetchOne();
		} else if (status.equals("매칭실패")) {
			cnt = jpaQueryFactory.select(request.count()).from(request)
					.where(request.userUsername.eq(username),
							request.status.eq("RECRUITED").or(request.status.eq("STOPPED")), JPAExpressions.selectOne()
									.from(matching).where(matching.requestIdx.eq(request.requestIdx)).notExists())
					.fetchOne();
		}

		return cnt;
	}

	// [일반사용자]진행중인 요청서 조회
	public RequestActiveDetailDto selectUserRequestActiveDetail(String username) throws Exception {
		QRequest request = QRequest.request;
		QCategory category1 = new QCategory("category1");
		QCategory category2 = new QCategory("category2");
		QCategory category3 = new QCategory("category3");
		QExpertFile expertFile1 = new QExpertFile("expertFile1");
		QExpertFile expertFile2 = new QExpertFile("expertFile2");
		QExpertFile expertFile3 = new QExpertFile("expertFile3");

		return jpaQueryFactory
				.select(Projections.constructor(RequestActiveDetailDto.class, request.requestIdx, request.createdAt,
						category1.name, category2.name, category3.name, request.budget, request.preferredDate,
						request.location, request.constructionSize, request.purpose, request.place,
						request.additionalRequest, request.status, expertFile1.fileRename, expertFile2.fileRename,
						expertFile3.fileRename))
				.from(request).leftJoin(category1).on(request.largeServiceIdx.eq(category1.categoryIdx))
				.leftJoin(category2).on(request.midServiceIdx.eq(category2.categoryIdx)).leftJoin(category3)
				.on(request.smallServiceIdx.eq(category3.categoryIdx)).leftJoin(expertFile1)
				.on(expertFile1.expertFileIdx.eq(request.image1Idx)).leftJoin(expertFile2)
				.on(expertFile2.expertFileIdx.eq(request.image2Idx)).leftJoin(expertFile3)
				.on(expertFile3.expertFileIdx.eq(request.image3Idx))
				.where(request.userUsername.eq(username), request.status.eq("RECRUITING")).fetchOne();
	}

	// [일반사용자]진행중인 요청서 조회 - 전문가 목록
	public List<RequestActiveExpertListDto> getRequestActiveExpertList(Integer requestIdx) throws Exception {
		QEstimate estimate = QEstimate.estimate;
		QExpert expert = QExpert.expert;
		QEstimateCost estimateCost = QEstimateCost.estimateCost;
		QExpertFile expertFile = QExpertFile.expertFile;

		return jpaQueryFactory
				.select(Projections.constructor(RequestActiveExpertListDto.class, estimate.estimateIdx,
						expert.activityName, expertFile.fileRename,
						estimateCost.amount.sum().coalesce(0).add(estimate.disposalCost.coalesce(0))
								.add(estimate.demolitionCost.coalesce(0)).add(estimate.etcFee.coalesce(0))
								.add(estimate.consultingLaborCost.coalesce(0))
								.add(estimate.stylingDesignCost.coalesce(0)).add(estimate.threeDImageCost.coalesce(0))
								.add(estimate.reportProductionCost.coalesce(0))))
				.from(estimate).leftJoin(expert).on(estimate.expert.expertIdx.eq(expert.expertIdx))
				.leftJoin(estimateCost).on(estimateCost.estimateIdx.eq(estimate.estimateIdx)).leftJoin(expertFile)
				.on(expertFile.expertFileIdx.eq(expert.profileImageIdx)).where(estimate.requestIdx.eq(requestIdx))
				.groupBy(estimate.estimateIdx, estimate.disposalCost, estimate.demolitionCost, estimate.etcFee,
						estimate.consultingLaborCost, estimate.stylingDesignCost, estimate.threeDImageCost,
						estimate.reportProductionCost)
				.fetch();

	}
}
