package com.zipddak.seller.repository;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.dto.ExchangeDto;
import com.zipddak.dto.OrderDto;
import com.zipddak.dto.RefundDto;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.QExchange;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QRefund;
import com.zipddak.seller.dto.SearchConditionDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerExchangeRepository {
	
	private final JPAQueryFactory jpaQueryFactory;
	
	private List<OrderItem.OrderStatus> exchangeStatuses 
											= Arrays.asList(OrderItem.OrderStatus.교환요청, 
															OrderItem.OrderStatus.교환회수, 
															OrderItem.OrderStatus.교환발송, 
															OrderItem.OrderStatus.교환완료,
															OrderItem.OrderStatus.교환거절);

	// ============================
	// 주문건 중 교환진행 리스트 조회
	// ============================
	public List<ExchangeDto> searchMyExchanges(String sellerUsername, PageRequest pr, SearchConditionDto scDto) {
		QExchange exchange = QExchange.exchange;
		QOrder order = QOrder.order;
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		return jpaQueryFactory.select(Projections.fields(ExchangeDto.class,
												exchange.exchangeIdx.as("exchangeIdx"),
												exchange.orderIdx.as("orderIdx"),
							                order.orderCode.as("orderCode"),
							                order.createdAt.as("orderDate"),
							                product.name.min().as("exchangeProductName"), // 대표 상품명
							                order.user.username.as("customerUsername"), //구매자
							                exchange.pickupPostComp.as("pickupPostComp"),
							                exchange.pickupTrackingNo.as("pickupTrackingNo"),
							                exchange.reshipPostComp.as("reshipPostComp"),
							                exchange.reshipTrackingNo.as("reshipTrackingNo"),
							                item.orderStatus.min().as("orderStatus"),	// 대표 처리 상태
							                item.countDistinct().as("exchangeItemCount")  // 반품 상품 개수
												))	
										.from(exchange)
							        .join(order).on(order.orderIdx.eq(exchange.orderIdx))
							        .join(item).on(order.orderIdx.eq(item.orderIdx))
							        .join(product).on(product.productIdx.eq(item.product.productIdx))
							        .where(item.orderStatus.in(exchangeStatuses),
							        		product.sellerUsername.eq(sellerUsername),
											QPredicate.eq(order.user.username, scDto.getCustomerUsername()),
											QPredicate.anyContains(scDto.getKeyword(), 
																	order.orderCode, 
																	order.postRecipient, 
																	order.phone,
																	product.name),
											QPredicate.dateEq(order.createdAt, scDto.getSearchDate()))
							        .orderBy(item.createdAt.desc())
							        .offset(pr.getOffset())
							        .limit(pr.getPageSize())
							        .fetch();
	}

	public Long countMyExchanges(String sellerUsername, SearchConditionDto scDto) {
		QOrderItem item = QOrderItem.orderItem;
		
		return jpaQueryFactory.select(item.count())
					            .from(item)
					            .where(item.orderStatus.in(exchangeStatuses))
					            .fetchOne();
	}

}
