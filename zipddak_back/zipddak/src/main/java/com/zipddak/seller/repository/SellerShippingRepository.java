package com.zipddak.seller.repository;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.dto.ShippingManageDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerShippingRepository {

	private final JPAQueryFactory jpaQueryFactory;

	private List<OrderItem.OrderStatus> shippingStatuses 
				= Arrays.asList(OrderItem.OrderStatus.배송중,
								OrderItem.OrderStatus.배송완료, 
								OrderItem.OrderStatus.교환요청, 
								OrderItem.OrderStatus.교환회수,
								OrderItem.OrderStatus.교환발송, 
								OrderItem.OrderStatus.교환완료, 
								OrderItem.OrderStatus.교환거절,
								OrderItem.OrderStatus.반품요청, 
								OrderItem.OrderStatus.반품회수, 
								OrderItem.OrderStatus.반품완료,
								OrderItem.OrderStatus.반품거절);

	// ============================
	// 주문건 중 배송진행 리스트 조회
	// ============================
	public List<ShippingManageDto> searchMyShippings(String sellerUsername, PageRequest pageRequest, SearchConditionDto scDto) {
		QOrder order = QOrder.order;
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;

		 return jpaQueryFactory.select(Projections.fields(ShippingManageDto.class,
				 						order.orderIdx,
					                    order.orderCode,
					                    order.createdAt.as("orderDate"),
					                    item.firstShipDate,     
					                    item.postComp,					                 
					                    item.trackingNo,
					                    item.orderStatus.stringValue().min().as("orderStatus"),	// 대표 주문 상태
					                    item.count().as("itemCount"),  //배송중인 상품 개수 
										product.name.min().as("shippingProductName")))	// 대표 상품명
					            .from(item)
					            .join(order).on(order.orderIdx.eq(item.orderIdx))
					            .join(product).on(product.productIdx.eq(item.product.productIdx))
					            .where(product.sellerUsername.eq(sellerUsername),
					            		item.trackingNo.isNotNull(),
					            		item.orderStatus.in(shippingStatuses))
					            .groupBy(item.trackingNo, item.postComp)
					            .orderBy(item.createdAt.desc())
					            .offset(pageRequest.getOffset())
					            .limit(pageRequest.getPageSize())
					            .fetch();
	}

	// ============================
	// 주문건 중 배송진행 수
	// ============================
	public Long countMyShippings(String sellerUsername, SearchConditionDto scDto) {
		QOrder order = QOrder.order;
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;

		 return (long) jpaQueryFactory.select(item.trackingNo, item.postComp)
							            .from(item)
							            .join(order).on(order.orderIdx.eq(item.orderIdx))
							            .join(product).on(product.productIdx.eq(item.product.productIdx))
							            .where(
							                    product.sellerUsername.eq(sellerUsername),
							                    item.trackingNo.isNotNull(),
							                    item.orderStatus.in(shippingStatuses)
							            )
							            .groupBy(item.trackingNo, item.postComp)   //리스트와 동일한 기준
							            .fetch()
							            .size();
	}

}
