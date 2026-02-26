package com.zipddak.seller.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Order;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.seller.dto.SalesAggregationDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerSalesRepository {
	
	private final JPAQueryFactory jpaQueryFactory;
	
	QOrder order = QOrder.order;
	QOrderItem item = QOrderItem.orderItem;
	QProduct product = QProduct.product;
	QCategory category = QCategory.category;
	
	private BooleanExpression todayCondition(LocalDate startDate, LocalDate endDate) {
	    Date start = Date.valueOf(startDate);
	    Date end = Date.valueOf(endDate.plusDays(1));

	    return order.paymentStatus.eq(Order.PaymentStatus.결제완료)
							            .and(order.createdAt.goe(start))
							            .and(order.createdAt.lt(end));
	}
	
	// OrderItem의 unitPrice * quantity 합을 계산하는 수식
    NumberExpression<Long> itemRevenue = item.unitPrice.multiply(item.quantity);
	
	//기간별 총매출 
	public long findPeriodSalesBySeller(String sellerUsername, LocalDate startDate, LocalDate endDate) {

		// QueryDSL 타입 맞추기 + 날짜 범위 
        Date start = Date.valueOf(startDate);
        Date end = Date.valueOf(endDate.plusDays(1));
		
        Long totalRevenue = jpaQueryFactory.select(itemRevenue.sum())  // (단가 * 수량)의 합을 선택
                							.from(item) 
            								.join(item.product, product) 
        									.join(order).on(item.orderIdx.eq(order.orderIdx))
							                .where(product.sellerUsername.eq(sellerUsername),
							                		item.orderStatus.eq(OrderItem.OrderStatus.배송완료),
								                    item.createdAt.goe(start), 
								                    item.createdAt.lt(end)   
							                )
							                .fetchOne();

            return (totalRevenue != null) ? totalRevenue : 0L;
    }
	
	
	//당일 매출액 (총 결제금액 기준)
	public long findTodaySalesBySeller(String sellerUsername, LocalDate startDate, LocalDate endDate) {

		Long sum = jpaQueryFactory.select(order.totalAmount.sum())
						            .from(item)
						            .join(item.product, product)
						            .join(order).on(item.orderIdx.eq(order.orderIdx))
						            .where(product.sellerUsername.eq(sellerUsername),
						            		todayCondition(startDate, endDate)
						            )
						            .fetchOne();

	    return sum != null ? sum : 0L;
    }
	
	//당일 예상 정산금액 (총 결제금액 × 0.95)
	public long findTodayExpectSettle(String sellerUsername, LocalDate startDate, LocalDate endDate) {
		
		NumberExpression<Long> settlementExpr = order.totalAmount.multiply(95).divide(100);

	    Long sum = jpaQueryFactory.select(settlementExpr.sum())
						            .from(item)
						            .join(item.product, product)
						            .join(order).on(item.orderIdx.eq(order.orderIdx))
						            .where(product.sellerUsername.eq(sellerUsername),
						            		todayCondition(startDate, endDate)
						            )
						            .fetchOne();

	    return sum != null ? sum : 0L;
    }
	
	//당일 평균 주문 금액 (총 결제금액 / 주문 수)
	public long findTodayAverageOrderAmount(String sellerUsername, LocalDate startDate, LocalDate endDate) {
		
		Tuple tuple = jpaQueryFactory.select(order.totalAmount.sum(),
						                	order.orderIdx.countDistinct()
						            )
						            .from(item)
						            .join(item.product, product)
						            .join(order).on(item.orderIdx.eq(order.orderIdx))
						            .where(product.sellerUsername.eq(sellerUsername),
						            		todayCondition(startDate, endDate)
						            )
						            .fetchOne();

	    if (tuple == null || tuple.get(order.orderIdx.countDistinct()) == 0) {
	        return 0L;
	    }

	    return tuple.get(order.totalAmount.sum()) / tuple.get(order.orderIdx.countDistinct());
    }
	
	//오늘 매출
	public long findTodayRevenue(String sellerUsername, LocalDate today) {
		 return findTodaySalesBySeller(sellerUsername, today, today);
    }

	//일자별 테이블 (누락 날짜 0원 채우기)
	public List<SalesAggregationDto> findDailySalesTable(String sellerUsername, LocalDate startDate, LocalDate endDate) {
        
		Date start = Date.valueOf(startDate);
	    Date end = Date.valueOf(endDate.plusDays(1));
	    
		return jpaQueryFactory.select(Projections.constructor(SalesAggregationDto.class,
						            	Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m-%d')",item.createdAt),
														            category.categoryIdx,
														            itemRevenue.sum()
						        ))
								.from(item) 
								.join(item.product, product)
						        .join(order).on(item.orderIdx.eq(order.orderIdx))
						        .join(category).on(product.categoryIdx.eq(category.categoryIdx))
						        .where(product.sellerUsername.eq(sellerUsername),
				                		item.orderStatus.eq(OrderItem.OrderStatus.배송완료),
					                    item.createdAt.goe(start), 
					                    item.createdAt.lt(end))
						        .groupBy(Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m-%d')",item.createdAt),
						        									category.categoryIdx
						        )
						        .fetch();
	}

	//월별
	public List<SalesAggregationDto> findMonthlySalesTable(String sellerUsername, LocalDate startDate, LocalDate endDate) {
		
		Date start = Date.valueOf(startDate);
	    Date end = Date.valueOf(endDate.plusDays(1));
		
		return jpaQueryFactory.select(Projections.constructor(SalesAggregationDto.class,
																Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m')",item.createdAt),
													            category.categoryIdx,
													            itemRevenue.sum()
						        ))
								.from(item) 
								.join(item.product, product)
						        .join(order).on(item.orderIdx.eq(order.orderIdx))
						        .join(category).on(product.categoryIdx.eq(category.categoryIdx))
						        .where(product.sellerUsername.eq(sellerUsername),
				                		item.orderStatus.eq(OrderItem.OrderStatus.배송완료),
					                    item.createdAt.goe(start), 
					                    item.createdAt.lt(end))
						        .groupBy(Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m')",item.createdAt),
						        									category.categoryIdx
						        )
						        .fetch();
	}


	//년도별
	public List<SalesAggregationDto> findYearlySalesTable(String sellerUsername, LocalDate startDate, LocalDate endDate) {
		Date start = Date.valueOf(startDate);
	    Date end = Date.valueOf(endDate.plusDays(1));
		
		return jpaQueryFactory.select(Projections.constructor(SalesAggregationDto.class,
																Expressions.stringTemplate("YEAR({0})",item.createdAt),
													            category.categoryIdx,
													            itemRevenue.sum()
						        ))
								.from(item) 
								.join(item.product, product)
						        .join(order).on(item.orderIdx.eq(order.orderIdx))
						        .join(category).on(product.categoryIdx.eq(category.categoryIdx))
						        .where(product.sellerUsername.eq(sellerUsername),
				                		item.orderStatus.eq(OrderItem.OrderStatus.배송완료),
					                    item.createdAt.goe(start), 
					                    item.createdAt.lt(end))
						        .groupBy(Expressions.stringTemplate("YEAR({0})",item.createdAt),
						        								category.categoryIdx
						        )
					        	.fetch();
	}
	
	
	


	
	

}
