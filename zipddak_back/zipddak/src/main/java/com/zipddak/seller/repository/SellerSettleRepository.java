package com.zipddak.seller.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Order;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.Product;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.seller.dto.SalesDailyDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerSettleRepository {
	
	private final JPAQueryFactory jpaQueryFactory;
	
	QOrder order = QOrder.order;
	QOrderItem item = QOrderItem.orderItem;
	QProduct product = QProduct.product;
	QCategory category = QCategory.category;
	
	//셀러별 기본 배송비, 무료배송기준금액(임시) 추후 join으로 다시 가져올것 
    long SELLER_BASE_SHIPPING_FEE = 3000L;
    long FREE_SHIPPING_THRESHOLD = 50000L;
    
	// OrderItem의 unitPrice * quantity 합을 계산 (상품 매출)
	NumberExpression<Long> itemRevenue = item.unitPrice.multiply(item.quantity); 
	// 주문 × 셀러 총 상품금액
    NumberExpression<Long> sellerOrderAmount = itemRevenue.sum();
	// 단품 배송비
    NumberExpression<Long> singleShippingFee = new CaseBuilder().when(product.postType.eq(Product.PostType.single))
									                			.then(product.postCharge.multiply(item.quantity))
									                			.otherwise(0L);
    // 묶음 배송비 계산
    NumberExpression<Long> bundleShippingFee = new CaseBuilder().when(product.postType.eq(Product.PostType.bundle)
                                									.and(sellerOrderAmount.goe(FREE_SHIPPING_THRESHOLD))
											                    )
											                    .then(0L)
											                    .when(product.postType.eq(Product.PostType.bundle))
											                    .then(SELLER_BASE_SHIPPING_FEE)
											                    .otherwise(0L);
    // 최종 배송비 (주문 × 셀러 기준 1회)
    NumberExpression<Long> shippingFee = singleShippingFee.sum().add(bundleShippingFee.max());
    
    // 날짜 (일자별)
    DateTemplate<LocalDate> salesDate = Expressions.dateTemplate(LocalDate.class, "DATE({0})", order.createdAt);

    // 매출 인정 상태
    Set<OrderItem.OrderStatus> SALES_STATUSES = Set.of(OrderItem.OrderStatus.배송완료);
    
    
	//선택한 월의 일별 매출 
	public List<SalesDailyDto> findMonthlyDailySales(String sellerUsername, LocalDate startDate, LocalDate endDate) {
		Date start = Date.valueOf(startDate);
        Date end = Date.valueOf(endDate.plusDays(1));
        
		return jpaQueryFactory.select(Projections.constructor(SalesDailyDto.class, 
																 salesDate,
												                 sellerOrderAmount,
												                 shippingFee,
												                 sellerOrderAmount.subtract(shippingFee)
						        ))
								.from(order)
				                .join(item).on(item.orderIdx.eq(order.orderIdx))
				                .join(product).on(item.product.eq(product))
						        .where(product.sellerUsername.eq(sellerUsername),
						        		order.paymentStatus.eq(Order.PaymentStatus.결제완료),
				                        item.orderStatus.in(SALES_STATUSES),
				                        order.createdAt.goe(start),
				                        order.createdAt.lt(end)
						        )
						        .groupBy(salesDate, order.orderIdx, product.sellerUsername)  //주문, 셀러, 날짜 단위로 묶음
						        .orderBy(salesDate.asc())
						        .fetch();
	}
	//인덱스 필수 
//	CREATE INDEX idx_orders_created ON orders (created_at);
//	CREATE INDEX idx_orderitem_order_status ON order_item (order_idx, order_status);
//	CREATE INDEX idx_product_seller ON product (seller_username);

}
