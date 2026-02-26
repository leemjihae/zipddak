package com.zipddak.mypage.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QSettlement;
import com.zipddak.entity.Settlement.TargetType;
import com.zipddak.mypage.dto.SettlementListDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SettlementDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 정산목록
	public SettlementListDto selectSettlementList(String username, PageRequest pageRequest, Date startDate,
			Date endDate) throws Exception {

		QSettlement settlement = QSettlement.settlement;
		QMatching matching = QMatching.matching;
		QEstimate estimate = QEstimate.estimate;
		QPayment payment = QPayment.payment;
		QCategory category = QCategory.category;

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(settlement.targetUsername.eq(username).and(settlement.targetType.eq(TargetType.EXPERT)));

		// 날짜 조건
		if (startDate != null) {
			builder.and(settlement.completedAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(settlement.completedAt.loe(endDate));
		}

		// 총 매출 건 수
		Integer totalSalesCount = jpaQueryFactory.select(settlement.count().intValue()).from(settlement)
				.where(settlement.targetUsername.eq(username)).fetchOne();

		// 이번 달 총 매출금액
		Integer totalSalesAmount = jpaQueryFactory.select(settlement.amount.sum().intValue()).from(settlement)
				.where(settlement.targetUsername.eq(username)).fetchOne();

		// 정산 대상 목록
		List<SettlementListDto.SettlementItemDto> settlementItems = jpaQueryFactory
				.select(Projections.fields(SettlementListDto.SettlementItemDto.class,

						settlement.settlementIdx.as("settlementIdx"), settlement.amount.as("settlementAmount"),
						Expressions.numberTemplate(Integer.class, "{0} - {1}", payment.totalAmount, settlement.amount)
								.as("platformFee"),
						settlement.state.as("state"), settlement.completedAt.as("completedAt"),
						settlement.comment.as("comment"), payment.totalAmount.as("customerPayment"),
						category.name.as("serviceName"), matching.workStartDate.as("workStartDate"),
						matching.workEndDate.as("workEndDate"),

						// workDays = end - start
						Expressions.numberTemplate(Integer.class, "DATEDIFF({0}, {1})", matching.workEndDate,
								matching.workStartDate).as("workDays")))
				.from(settlement).leftJoin(matching).on(matching.matchingIdx.eq(settlement.workIdx)).leftJoin(payment)
				.on(payment.paymentIdx.eq(matching.paymentIdx)).leftJoin(estimate)
				.on(estimate.estimateIdx.eq(matching.estimateIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(estimate.largeServiceIdx)).where(builder).offset(pageRequest.getOffset())
				.orderBy(settlement.completedAt.desc()).limit(pageRequest.getPageSize()).fetch();

		return SettlementListDto.builder().totalSalesCount(totalSalesCount != null ? totalSalesCount : 0)
				.totalSalesAmountInteger(totalSalesAmount != null ? totalSalesAmount : 0)
				.settlementItems(settlementItems).build();

	}

	// 정산목록 개수
	public Long selectSettlementCount(String username, Date startDate, Date endDate) throws Exception {
		QSettlement settlement = QSettlement.settlement;

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(settlement.targetUsername.eq(username).and(settlement.targetType.eq(TargetType.EXPERT)));

		// 날짜 조건
		if (startDate != null) {
			builder.and(settlement.completedAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(settlement.completedAt.loe(endDate));
		}

		return jpaQueryFactory.select(settlement.count()).from(settlement).where(builder).fetchOne();
	}

}
