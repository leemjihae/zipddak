package com.zipddak.admin.repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.MonthlyStatDto;
import com.zipddak.dto.PaymentDto;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QUser;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.entity.User.UserState;

@Repository
public class AdminDashBoardDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	// 멤버십 수익률
	// 멤버십 수익률
	public Map<String, Object> commission(YearMonth thisMonth, PaymentType type) {

	    QPayment payment = QPayment.payment;

	    // ===== 이번 달 =====
	    LocalDateTime startOfMonth = thisMonth.atDay(1).atStartOfDay();
	    LocalDateTime endOfMonth = thisMonth.atEndOfMonth().atTime(23, 59, 59);

	    BooleanBuilder where = new BooleanBuilder();
	    where.and(payment.approvedAt.between(
	            Timestamp.valueOf(startOfMonth),
	            Timestamp.valueOf(endOfMonth)
	    ));

	    if (type != null) {
	        where.and(payment.paymentType.eq(PaymentType.MEMBERSHIP));
	    } else {
	        where.and(payment.paymentType.ne(PaymentType.MEMBERSHIP));
	    }

	    Integer totalAmountResult = jpaQueryFactory
	            .select(payment.totalAmount.sum())
	            .from(payment)
	            .where(where)
	            .fetchOne();

	    int totalAmount = totalAmountResult == null ? 0 : totalAmountResult;

	    // ===== 전월 =====
	    YearMonth previousMonth = thisMonth.minusMonths(1);
	    LocalDateTime startOfPrevMonth = previousMonth.atDay(1).atStartOfDay();
	    LocalDateTime endOfPrevMonth = previousMonth.atEndOfMonth().atTime(23, 59, 59);

	    BooleanBuilder where2 = new BooleanBuilder();
	    where2.and(payment.approvedAt.between(
	            Timestamp.valueOf(startOfPrevMonth),
	            Timestamp.valueOf(endOfPrevMonth)
	    ));

	    if (type != null) {
	        where2.and(payment.paymentType.eq(PaymentType.MEMBERSHIP));
	    } else {
	        where2.and(payment.paymentType.ne(PaymentType.MEMBERSHIP));
	    }

	    Integer beforeTotalAmountResult = jpaQueryFactory
	            .select(payment.totalAmount.sum())
	            .from(payment)
	            .where(where2)
	            .fetchOne();

	    int beforeTotalAmount = beforeTotalAmountResult == null ? 0 : beforeTotalAmountResult;

	    // ===== 수익률 계산 (type == null 인 경우 5%) =====
	    if (type == null) {
	        totalAmount = (int) Math.round(totalAmount * 0.05);
	        beforeTotalAmount = (int) Math.round(beforeTotalAmount * 0.05);
	    }

	    // ===== 증감률 계산 =====
	    double rateChange = 0.0;

	    if (beforeTotalAmount > 0) {
	        rateChange = (totalAmount - beforeTotalAmount) * 100.0 / beforeTotalAmount;
	    } else if (totalAmount > 0) {
	        rateChange = 100.0;
	    }

	    rateChange = Math.round(rateChange * 10) / 10.0;

	    // ===== 반환 =====
	    Map<String, Object> returnMap = new HashMap<>();
	    returnMap.put("amount", totalAmount);
	    returnMap.put("rateChange", rateChange);

	    return returnMap;
	}


	// 회원 수
	public Map<String, Object> userJoin(YearMonth thisMonth) {

		QUser user = QUser.user;
		
		// 이번달
	    LocalDate startOfMonth = thisMonth.atDay(1);
	    LocalDate endOfMonth = thisMonth.atEndOfMonth();
	    Date startDate = Date.valueOf(startOfMonth);
	    Date endDate = Date.valueOf(endOfMonth);

	    Long thisMonthCount = jpaQueryFactory
	            .select(user.count())
	            .from(user)
	            .where(user.createdate.between(startDate, endDate))
	            .fetchOne();
	    thisMonthCount = thisMonthCount != null ? thisMonthCount : 0;

	    // 전월
	    YearMonth previousMonth = thisMonth.minusMonths(1);
	    LocalDate startPrevMonth = previousMonth.atDay(1);
	    LocalDate endPrevMonth = previousMonth.atEndOfMonth();
	    Date startPrevDate = Date.valueOf(startPrevMonth);
	    Date endPrevDate = Date.valueOf(endPrevMonth);

	    Long prevMonthCount = jpaQueryFactory
	            .select(user.count())
	            .from(user)
	            .where(user.createdate.between(startPrevDate, endPrevDate))
	            .fetchOne();
	    prevMonthCount = prevMonthCount != null ? prevMonthCount : 0;

	    // 결과 Map
	    Map<String, Object> result = new HashMap<>();
	    result.put("thisMonthCount", thisMonthCount);
	    result.put("prevMonthCount", prevMonthCount);
		
		return result;
	}


	public Map<String, Object> userCount() {

		QUser user = QUser.user;
		
		long totalUser = jpaQueryFactory
						.select(user.count())
						.from(user)
						.fetchOne();
		
		long activeUser = jpaQueryFactory
						.select(user.count())
						.from(user)
						.where(user.state.eq(UserState.ACTIVE))
						.fetchOne();
		
		int activeRate = 0;
		
		if (totalUser > 0) {
		    activeRate = (int) Math.round(activeUser * 100.0 / totalUser);
		}

		Map<String, Object> result = new HashMap<>();
		result.put("totalUser", totalUser);
		result.put("activeUser", activeUser);
		result.put("activeRate", activeRate);
		
		
		return result;
	}

	public Map<String, Object> dougnut(YearMonth thisMonth) {

	    QPayment payment = QPayment.payment;

	    // 이번달 범위
	    LocalDateTime startOfMonth = thisMonth.atDay(1).atStartOfDay();
	    LocalDateTime endOfMonth = thisMonth.atEndOfMonth().atTime(23, 59, 59);

	    Timestamp startTimestamp = Timestamp.valueOf(startOfMonth);
	    Timestamp endTimestamp = Timestamp.valueOf(endOfMonth);
	    
	    BooleanBuilder baseWhere = new BooleanBuilder()
	            .and(payment.approvedAt.between(startTimestamp, endTimestamp));
	    
	    Integer membershipAmount = jpaQueryFactory
	            .select(payment.totalAmount.sum())
	            .from(payment)
	            .where(baseWhere,payment.paymentType.eq(PaymentType.MEMBERSHIP))
	            .fetchOne();

	    Integer matchingAmount = jpaQueryFactory
	            .select(payment.totalAmount.sum())
	            .from(payment)
	            .where(baseWhere, payment.paymentType.eq(PaymentType.MATCHING))
	            .fetchOne();

	    Integer orderAmount = jpaQueryFactory
	            .select(payment.totalAmount.sum())
	            .from(payment)
	            .where(baseWhere, payment.paymentType.eq(PaymentType.ORDER))
	            .fetchOne();
	    
	    Integer rentalAmount = jpaQueryFactory
	            .select(payment.totalAmount.sum())
	            .from(payment)
	            .where(baseWhere, payment.paymentType.eq(PaymentType.RENTAL))
	            .fetchOne();
	    
	    int membership = membershipAmount == null ? 0 : membershipAmount;
	    int matchingFee = matchingAmount == null ? 0 : (int) Math.round(matchingAmount * 0.05);
	    int orderFee = orderAmount == null ? 0 : (int) Math.round(orderAmount * 0.05);
	    int rentalFee = rentalAmount == null ? 0 : (int) Math.round(rentalAmount * 0.05);

	    Map<String, Object> result = new HashMap<>();
	    result.put("membership", membership);
	    result.put("matchingFee", matchingFee);
	    result.put("orderFee", orderFee);
	    result.put("rentalFee", rentalFee);
		
		return result;
	}


	public List<MonthlyStatDto> line(YearMonth thisMonth, String type) {

	    QPayment payment = QPayment.payment;

	    // 1️⃣ paymentType 결정
	    PaymentType paymentType;
	    BigDecimal feeRate;

	    if ("matching".equalsIgnoreCase(type)) {
	        paymentType = PaymentType.MATCHING;
	        feeRate = BigDecimal.valueOf(0.05);
	    } else if ("order".equalsIgnoreCase(type)) {
	        paymentType = PaymentType.ORDER;
	        feeRate = BigDecimal.valueOf(0.05); // 주문 수수료 다르면 여기만 변경
	    } else {
	        throw new IllegalArgumentException("지원하지 않는 타입입니다: " + type);
	    }

	    // 2️⃣ 조회 기간 계산
	    YearMonth startMonth = thisMonth.minusMonths(5);
	    YearMonth endMonth = thisMonth;

	    LocalDateTime startDate = startMonth.atDay(1).atStartOfDay(); // 6개월 전 첫날 00:00
	    LocalDateTime endDate = endMonth.atEndOfMonth().atTime(23, 59, 59); // 이번 달 마지막날 23:59:59

	    Timestamp startTimestamp = Timestamp.valueOf(startDate);
	    Timestamp endTimestamp = Timestamp.valueOf(endDate);

	    // 3️⃣ Expression 분리
	    NumberExpression<Integer> yearExpr = payment.approvedAt.year();
	    NumberExpression<Integer> monthExpr = payment.approvedAt.month();

	    NumberExpression<BigDecimal> feeExpr =
	            payment.totalAmount
	                   .castToNum(BigDecimal.class)
	                   .multiply(feeRate)
	                   .sum();

	    // 4️⃣ 월별 수수료 조회
	    List<Tuple> result = jpaQueryFactory
	            .select(yearExpr, monthExpr, feeExpr)
	            .from(payment)
	            .where(
	                    payment.paymentType.eq(paymentType),
	                    payment.approvedAt.between(startTimestamp, endTimestamp)
	            )
	            .groupBy(yearExpr, monthExpr)
	            .fetch();

	    // 5️⃣ 결과 Map 변환
	    Map<YearMonth, Long> resultMap = result.stream()
	            .collect(Collectors.<Tuple, YearMonth, Long>toMap(
	                    t -> YearMonth.of(
	                            t.get(yearExpr),
	                            t.get(monthExpr)
	                    ),
	                    t -> {
	                        BigDecimal v = t.get(feeExpr);
	                        return v == null
	                                ? 0L
	                                : v.setScale(0, RoundingMode.HALF_UP).longValue();
	                    }
	            ));

	    // 6️⃣ 6개월 고정 + 누락 월 0 처리
	    List<MonthlyStatDto> graphData = new ArrayList<>();

	    for (int i = 5; i >= 0; i--) {
	        YearMonth month = thisMonth.minusMonths(i);
	        graphData.add(
	                new MonthlyStatDto(
	                        month,
	                        resultMap.getOrDefault(month, 0L)
	                )
	        );
	    }

	    return graphData;
	}





	
}
