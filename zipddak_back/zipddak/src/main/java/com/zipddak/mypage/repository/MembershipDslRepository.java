package com.zipddak.mypage.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Membership;
import com.zipddak.entity.QMembership;
import com.zipddak.entity.QPayment;
import com.zipddak.mypage.dto.MembershipListDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MembershipDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 멤버십 목록
	public MembershipListDto selectMembershipList(String username, PageRequest pageRequest) throws Exception {

		QMembership membership = QMembership.membership;
		QPayment payment = QPayment.payment;

		BooleanBuilder builder = new BooleanBuilder();

		// 기본 조건
		builder.and(membership.username.eq(username));

		// 해당 유저의 모든 멤버십 구간 조회
		List<Membership> membershipList = jpaQueryFactory.select(membership).from(membership)
				.where(membership.username.eq(username)).fetch();

		// 마지막 종료일 계산
		Date finishDate = membershipList.stream().map(m -> m.getEndDate()).max(Date::compareTo).orElse(null);

		// 총 멤버십 개월 수
		long totalMembershipMonths = membershipList.size();

		// 현재 멤버십 활성 여부 계산
		boolean isActiveMembership = false;
		if (finishDate != null) {
			Date today = new Date(System.currentTimeMillis());
			isActiveMembership = !finishDate.before(today);
		}

		// 멤버십 결제 목록
		List<MembershipListDto.MembershipPaymentDto> payments = jpaQueryFactory
				.select(Projections.fields(MembershipListDto.MembershipPaymentDto.class,
						membership.membershipIdx.as("membershipIdx"), payment.approvedAt.as("paymentDate"),
						payment.orderName.as("paymentName"), membership.startDate.as("usagePeriodStart"),
						membership.endDate.as("usagePeriodEnd"), payment.receiptUrl.as("receiptUrl"),
						payment.totalAmount.as("amount"), payment.method.as("paymentMethod")))
				.from(membership).leftJoin(payment).on(payment.paymentIdx.eq(membership.paymentIdx)).where(builder)
				.orderBy(membership.startDate.desc()).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize())
				.fetch();

		return MembershipListDto.builder().finishDate(finishDate).totalMembershipMonths(totalMembershipMonths)
				.isActiveMembership(isActiveMembership).payments(payments).build();
	}

	// 멤버십 결제 개수
	public Long selectPaymentCount(String username) throws Exception {
		QMembership membership = QMembership.membership;

		return jpaQueryFactory.select(membership.count()).from(membership).where(membership.username.eq(username))
				.fetchOne();
	}

}
