package com.zipddak.seller.repository;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Expression;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.dto.OrderItemDto;
import com.zipddak.dto.RefundDto;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.entity.QClaimFile;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QProductOption;
import com.zipddak.entity.QRefund;
import com.zipddak.entity.QSeller;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.dto.SellerOrderAmountDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerRefundRepository {

	private final JPAQueryFactory jpaQueryFactory;

	private List<OrderItem.OrderStatus> refundStatuses = Arrays.asList(OrderItem.OrderStatus.반품요청,
																		OrderItem.OrderStatus.반품회수, 
																		OrderItem.OrderStatus.반품완료, 
																		OrderItem.OrderStatus.반품거절);

	// ============================
	// 주문건 중 반품요청,진행 리스트 조회
	// ============================
	public List<RefundDto> searchMyRefunds(String sellerUsername, PageRequest pr, SearchConditionDto scDto) {
		QRefund refund = QRefund.refund;
		QOrder order = QOrder.order;
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		
		Expression<String> refundProductName = JPAExpressions.select(product.name)
												        .from(item)
												        .join(product).on(product.productIdx.eq(item.product.productIdx))
												        .where(item.refundIdx.eq(refund.refundIdx),
												        		item.orderItemIdx.eq(JPAExpressions.select(item.orderItemIdx.min())
																				                    .from(item)
																				                    .where(item.refundIdx.eq(refund.refundIdx))
												            )
												        );

		return jpaQueryFactory.select(Projections.fields(RefundDto.class,
				        refund.refundIdx,
				        refund.orderIdx,
				        refund.pickupPostComp,
				        refund.pickupTrackingNo,
				        refund.createdAt,
				        order.orderCode,
				        order.createdAt.as("orderDate"),
				        order.user.username.as("username"),
				        ExpressionUtils.as(refundProductName, "refundProductName"),
				        item.orderStatus.stringValue().min().as("orderStatus"),
				        item.orderItemIdx.count().as("refundItemCount")
				    ))
				    .from(refund) 
				    .join(item).on(item.refundIdx.eq(refund.refundIdx))
				    .join(product).on(product.productIdx.eq(item.product.productIdx))
				    .join(order).on(order.orderIdx.eq(refund.orderIdx))
				    .where(
				        product.sellerUsername.eq(sellerUsername),
				        QPredicate.eq(order.user.username, scDto.getCustomerUsername()),
				        QPredicate.anyContains(
				            scDto.getKeyword(),
				            order.orderCode,
				            order.postRecipient,
				            order.phone,
				            product.name
				        ),
				        QPredicate.dateEq(order.createdAt, scDto.getSearchDate())
				    )
				    .groupBy(refund.refundIdx)
				    .orderBy(refund.createdAt.desc())
				    .offset(pr.getOffset())
				    .limit(pr.getPageSize())
				    .fetch();
	}

	public Long countMyRefunds(String sellerUsername, SearchConditionDto scDto) {
		QRefund refund = QRefund.refund;
	    QOrder order = QOrder.order;
	    QOrderItem item = QOrderItem.orderItem;
	    QProduct product = QProduct.product;

		return jpaQueryFactory.select(refund.refundIdx.countDistinct())
		        .from(refund)
		        .join(order).on(order.orderIdx.eq(refund.orderIdx))
		        .join(item).on(item.refundIdx.eq(refund.refundIdx))
		        .join(product).on(product.productIdx.eq(item.product.productIdx))
		        .where(
		            product.sellerUsername.eq(sellerUsername),
		            item.orderStatus.in(refundStatuses),

		            QPredicate.eq(order.user.username, scDto.getCustomerUsername()),
		            QPredicate.anyContains(
		                scDto.getKeyword(),
		                order.orderCode,
		                order.postRecipient,
		                order.phone,
		                product.name
		            )
//		            QPredicate.dateEq(order.createdAt, scDto.getSearchDate())
		        )
		        .fetchOne();
	}

	// ============================
	// 주문건 중 반품요청,진행 상세보기 조회 (주문정보 + 주문아이템 정보 ) 
	// ============================
	//주문정보 
	public RefundDto findRefundOrderId(String sellerUsername, Integer refundIdx) {
		QOrder order = QOrder.order;
		QRefund refund = QRefund.refund;
		QPayment payment = QPayment.payment;
		QClaimFile refundImage1  = new QClaimFile("refundImage1");
		QClaimFile refundImage2  = new QClaimFile("refundImage2");
		QClaimFile refundImage3  = new QClaimFile("refundImage3");
		
		return jpaQueryFactory.select(Projections.fields(RefundDto.class,
										refund.refundIdx,
										refund.orderIdx,
										refund.reasonType,
										refund.reasonDetail,
										refund.image1Idx,
										refund.image2Idx,
										refund.image3Idx,
										refund.shippingChargeType.stringValue().as("shippingChargeType"),
										refund.returnShippingFee,
										refund.refundAmount,
										refund.pickupPostComp,
										refund.pickupTrackingNo,
										refund.createdAt,
										order.user.username,
										order.orderCode,
										order.postZonecode,
										order.postAddr1,
										order.postAddr2,
										order.postRecipient.as("customerName"),
										order.phone.as("customerPhone"),
										refundImage1.fileRename.as("refundImage1"),
										refundImage2.fileRename.as("refundImage2"),
										refundImage3.fileRename.as("refundImage3"),
										payment.easypayProvider.as("paymentMethod")
								))
								.from(refund)
								.join(order).on(order.orderIdx.eq(refund.orderIdx))
								.leftJoin(refundImage1).on(refundImage1.claimFileIdx.eq(refund.image1Idx))
								.leftJoin(refundImage2).on(refundImage2.claimFileIdx.eq(refund.image1Idx))
								.leftJoin(refundImage3).on(refundImage3.claimFileIdx.eq(refund.image1Idx))
								.leftJoin(payment).on(payment.paymentIdx.eq(order.paymentIdx))
								.where(refund.refundIdx.eq(refundIdx))
								.fetchOne();
	}
	//반품 요청된 주문상품 정보 
	public List<OrderItemDto> findRefundOrderItemList(String sellerUsername, Integer refundIdx) {
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QProductOption pdOption =  QProductOption.productOption;
		QProductFile pdFile = QProductFile.productFile;
		
		return jpaQueryFactory.select(Projections.fields(OrderItemDto.class,
												        item.orderItemIdx,
												        item.orderIdx,
												        item.productOptionIdx,
												        item.quantity,
												        item.unitPrice,
												        item.orderStatus.stringValue().as("orderStatus"),
												        item.postComp,
												        item.trackingNo,
												        pdFile.fileRename.as("thumbnailFileRename"),
												        item.refundRejectedAt,
												        item.refundAcceptedAt,
												        item.refundPickupComplatedAt,
												        item.refundComplatedAt,
												        product.name.as("productName"),
												        product.postCharge, 
												        product.postType.stringValue().as("postType"), // 배송방식 
												        pdOption.name.as("optionName"), // 옵션명 추가
												        pdOption.value.as("optionValue"), //옵션선택종류
												        pdOption.price.as("optionPrice") //옵션 추가가격 
						))
						.from(item)
						.join(product).on(item.product.productIdx.eq(product.productIdx))
						.leftJoin(pdOption).on(item.productOptionIdx.eq(pdOption.productOptionIdx)) 
						.leftJoin(pdFile).on(pdFile.productFileIdx.eq(product.thumbnailFileIdx))
						.where(product.sellerUsername.eq(sellerUsername)
						        .and(item.refundIdx.eq(refundIdx)))
						.fetch();
	}
	

	//구매자가 주문한 주문상품의 특정 셀러 총금액확인용 (무료배송 여부 확인용)
	public SellerOrderAmountDto findSellerOrderAmount(String sellerUsername, Integer orderIdx) {
		QOrder order = QOrder.order;
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		
		return jpaQueryFactory.select(Projections.constructor(SellerOrderAmountDto.class,
															order.orderIdx,
															item.unitPrice.multiply(item.quantity).sum().as("sellerOrderTotal"),
															seller.user.username,
													        seller.basicPostCharge,
													        seller.freeChargeAmount,
													        product.postCharge.as("singlePostCarge")
								))
								.from(order)
								.join(item).on(item.orderIdx.eq(order.orderIdx))
								.join(product).on(product.productIdx.eq(item.product.productIdx))
								.join(seller).on(seller.user.username.eq(product.sellerUsername))
								.where(order.orderIdx.eq(orderIdx), seller.user.username.eq(sellerUsername))
								.groupBy(order.orderIdx,seller.user.username,seller.basicPostCharge,seller.freeChargeAmount)
								.fetchOne();
		
	}
	
	
	//특정 반품건의 반품상품 금액만 계산
	public Long findRefundProductTotal(String sellerUsername, Integer refundIdx, Integer orderIdx) {
	    QOrderItem item = QOrderItem.orderItem;
	    QProduct product = QProduct.product;

	    Long result = jpaQueryFactory.select(item.unitPrice.multiply(item.quantity).sum())
						        .from(item)
						        .join(product).on(product.productIdx.eq(item.product.productIdx))
						        .where(item.orderIdx.eq(orderIdx),
						        		product.sellerUsername.eq(sellerUsername),
						        		item.refundIdx.eq(refundIdx),
						        		item.orderStatus.eq(OrderStatus.반품완료)
						        )
						        .fetchOne();
	    
	    return result != null ? result : 0L;
	}

	

	

}
