package com.zipddak.mypage.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Order.PaymentStatus;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.entity.QCancel;
import com.zipddak.entity.QExchange;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QProductOption;
import com.zipddak.entity.QRefund;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.OrderDetailDto;
import com.zipddak.mypage.dto.OrderItemFlatDto;
import com.zipddak.mypage.dto.OrderStatusSummaryDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 주문배송목록 조회
	public List<OrderItemFlatDto> selectOrderItemFlatList(String username, PageRequest pageRequest, Date startDate,
			Date endDate) throws Exception {

		QOrder order = QOrder.order;
		QOrderItem orderItem = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		QProductOption productOption1 = new QProductOption("productOption1");
		QProductOption productOption2 = new QProductOption("productOption2");
		QProductFile productFile = QProductFile.productFile;
		QReviewProduct reviewProduct = QReviewProduct.reviewProduct;
		QExchange exchange = new QExchange("exchange");
		QExchange exchangeSub = new QExchange("exchangeSub");
		QRefund refund = new QRefund("refund");
		QRefund refundSub = new QRefund("refundSub");

		// 택배사
		Expression<String> postCompExpr = new CaseBuilder().when(orderItem.orderStatus.eq(OrderStatus.교환회수))
				.then(exchange.pickupPostComp).when(orderItem.orderStatus.in(OrderStatus.교환발송, OrderStatus.교환완료))
				.then(exchange.reshipPostComp).when(orderItem.orderStatus.in(OrderStatus.반품회수, OrderStatus.반품완료))
				.then(refund.pickupPostComp).otherwise(orderItem.postComp);

		// 송장번호
		Expression<String> trackingNoExpr = new CaseBuilder().when(orderItem.orderStatus.eq(OrderStatus.교환회수))
				.then(exchange.pickupTrackingNo).when(orderItem.orderStatus.in(OrderStatus.교환발송, OrderStatus.교환완료))
				.then(exchange.reshipTrackingNo).when(orderItem.orderStatus.in(OrderStatus.반품회수, OrderStatus.반품완료))
				.then(refund.pickupTrackingNo).otherwise(orderItem.trackingNo);

		// 리뷰 가능 여부 조건
		BooleanExpression isReviewable = orderItem.orderStatus.eq(OrderStatus.배송완료).and(JPAExpressions.selectOne()
				.from(reviewProduct).where(reviewProduct.orderItemIdx.eq(orderItem.orderItemIdx)).notExists());

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(order.user.username.eq(username).and(order.paymentStatus.eq(PaymentStatus.결제완료)));

		// 날짜 조건
		if (startDate != null) {
			builder.and(orderItem.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(orderItem.createdAt.loe(endDate));
		}

		return jpaQueryFactory
				.select(Projections.constructor(OrderItemFlatDto.class, order.orderIdx, order.orderCode,
						order.createdAt, seller.brandName, orderItem.receiveWay, product.postType, product.postCharge,
						seller.freeChargeAmount, orderItem.orderItemIdx, product.productIdx, product.name,
						productOption1.name, orderItem.quantity, orderItem.unitPrice.as("price"),
						product.salePrice, product.price.as("productPrice"),
						productFile.fileRename.as("thumbnail"),
						trackingNoExpr, postCompExpr, orderItem.orderStatus,
						new CaseBuilder().when(isReviewable).then(true).otherwise(false).as("reviewAvailable"),
						productOption2.name))
				.from(orderItem).leftJoin(order).on(order.orderIdx.eq(orderItem.orderIdx)).leftJoin(product)
				.on(product.productIdx.eq(orderItem.product.productIdx)).leftJoin(seller)
				.on(seller.user.username.eq(product.sellerUsername)).leftJoin(productOption1)
				.on(productOption1.productOptionIdx.eq(orderItem.productOptionIdx)).leftJoin(productOption2)
				.on(productOption2.productOptionIdx.eq(orderItem.exchangeNewOptIdx)).leftJoin(productFile)
				.on(productFile.productFileIdx.eq(product.thumbnailFileIdx)).leftJoin(exchange)
				.on(exchange.orderIdx.eq(orderItem.orderIdx)
						.and(exchange.exchangeIdx.eq(JPAExpressions.select(exchangeSub.exchangeIdx.max())
								.from(exchangeSub).where(exchangeSub.orderIdx.eq(orderItem.orderIdx)))))
				.leftJoin(refund)
				.on(refund.orderIdx.eq(orderItem.orderIdx)
						.and(refund.refundIdx.eq(JPAExpressions.select(refundSub.refundIdx.max()).from(refundSub)
								.where(refundSub.orderIdx.eq(orderItem.orderIdx)))))
				.where(builder).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize())
				.orderBy(order.orderIdx.desc()).fetch();

	}

	// 주문배송목록 개수
	public Long selectOrderItemFlatCount(String username, Date startDate, Date endDate) throws Exception {
		QOrder order = QOrder.order;
		QOrderItem orderItem = QOrderItem.orderItem;

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(order.user.username.eq(username).and(order.paymentStatus.eq(PaymentStatus.결제완료)));

		// 날짜 조건
		if (startDate != null) {
			builder.and(orderItem.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(orderItem.createdAt.loe(endDate));
		}

		return jpaQueryFactory.select(orderItem.count()).from(orderItem).leftJoin(order)
				.on(order.orderIdx.eq(orderItem.orderIdx)).where(builder).fetchOne();
	}

	// 취소교환반품목록 조회
	public List<OrderItemFlatDto> selectReturnOrderItemFlatList(String username, PageRequest pageRequest,
			Date startDate, Date endDate) throws Exception {

		QOrder order = QOrder.order;
		QOrderItem orderItem = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		QProductOption productOption1 = new QProductOption("productOption1");
		QProductOption productOption2 = new QProductOption("productOption2");
		QProductFile productFile = QProductFile.productFile;
		QExchange exchange = new QExchange("exchange");
		QExchange exchangeSub = new QExchange("exchangeSub");
		QRefund refund = new QRefund("refund");
		QRefund refundSub = new QRefund("refundSub");

		// 택배사
		Expression<String> postCompExpr = new CaseBuilder().when(orderItem.orderStatus.eq(OrderStatus.교환회수))
				.then(exchange.pickupPostComp).when(orderItem.orderStatus.in(OrderStatus.교환발송, OrderStatus.교환완료))
				.then(exchange.reshipPostComp).when(orderItem.orderStatus.in(OrderStatus.반품회수, OrderStatus.반품완료))
				.then(refund.pickupPostComp).otherwise(orderItem.postComp);

		// 송장번호
		Expression<String> trackingNoExpr = new CaseBuilder().when(orderItem.orderStatus.eq(OrderStatus.교환회수))
				.then(exchange.pickupTrackingNo).when(orderItem.orderStatus.in(OrderStatus.교환발송, OrderStatus.교환완료))
				.then(exchange.reshipTrackingNo).when(orderItem.orderStatus.in(OrderStatus.반품회수, OrderStatus.반품완료))
				.then(refund.pickupTrackingNo).otherwise(orderItem.trackingNo);

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(order.user.username.eq(username).and(order.paymentStatus.ne(PaymentStatus.결제대기)));

		// 주문 상태 조건
		builder.and(orderItem.orderStatus.ne(OrderStatus.상품준비중));
		builder.and(orderItem.orderStatus.ne(OrderStatus.배송중));
		builder.and(orderItem.orderStatus.ne(OrderStatus.배송완료));

		// 날짜 조건
		if (startDate != null) {
			builder.and(orderItem.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(orderItem.createdAt.loe(endDate));
		}

		return jpaQueryFactory
				.select(Projections.constructor(OrderItemFlatDto.class,
						order.orderIdx,
						order.orderCode,
						order.createdAt.as("orderDate"),
						
						seller.brandName,
						orderItem.receiveWay.as("deliveryType"),
						product.postType.as("deliveryFeeType"),
						product.postCharge.as("deliveryFeePrice"),
						seller.freeChargeAmount,
						
						orderItem.orderItemIdx,
						product.productIdx,
						product.name.as("productName"),
						productOption1.name.as("optionName"),
						orderItem.quantity,
						orderItem.unitPrice.as("price"),
						product.salePrice.as("salePrice"),
						product.price.as("productPrice"),
						productFile.fileRename.as("thumbnail"),
						trackingNoExpr,
						postCompExpr,
						orderItem.orderStatus,
						Expressions.asBoolean(false),
						productOption2.name.as("exchangeOption")))
				.from(orderItem)
				.leftJoin(order).on(order.orderIdx.eq(orderItem.orderIdx))
				.leftJoin(product).on(product.productIdx.eq(orderItem.product.productIdx))
				.leftJoin(seller).on(seller.user.username.eq(product.sellerUsername))
				.leftJoin(productOption1).on(productOption1.productOptionIdx.eq(orderItem.productOptionIdx))
				.leftJoin(productOption2).on(productOption2.productOptionIdx.eq(orderItem.exchangeNewOptIdx))
				.leftJoin(productFile).on(productFile.productFileIdx.eq(product.thumbnailFileIdx))
				.leftJoin(exchange).on(exchange.orderIdx.eq(orderItem.orderIdx)
						.and(exchange.exchangeIdx.eq(JPAExpressions.select(exchangeSub.exchangeIdx.max())
								.from(exchangeSub).where(exchangeSub.orderIdx.eq(orderItem.orderIdx)))))
				.leftJoin(refund).on(refund.orderIdx.eq(orderItem.orderIdx)
						.and(refund.refundIdx.eq(JPAExpressions.select(refundSub.refundIdx.max()).from(refundSub)
								.where(refundSub.orderIdx.eq(orderItem.orderIdx)))))
				.where(builder).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();

	}

	// 취소교환반품목록 개수
	public Long selectReturnOrderItemFlatCount(String username, Date startDate, Date endDate) throws Exception {
		QOrder order = QOrder.order;
		QOrderItem orderItem = QOrderItem.orderItem;

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(order.user.username.eq(username).and(order.paymentStatus.ne(PaymentStatus.결제대기) ));

		// 주문 상태 조건
		builder.and(orderItem.orderStatus.ne(OrderStatus.상품준비중));
		builder.and(orderItem.orderStatus.ne(OrderStatus.배송중));
		builder.and(orderItem.orderStatus.ne(OrderStatus.배송완료));

		// 날짜 조건
		if (startDate != null) {
			builder.and(orderItem.createdAt.goe(startDate));
		}
		if (endDate != null) {
			builder.and(orderItem.createdAt.loe(endDate));
		}

		return jpaQueryFactory.select(orderItem.count()).from(orderItem).leftJoin(order)
				.on(order.orderIdx.eq(orderItem.orderIdx)).where(builder).fetchOne();
	}

	// 주문배송현황 요약
	public OrderStatusSummaryDto selectOrderStatusSummary(String username, Date todayDate, Date sixMonthsAgoDate)
			throws Exception {
		QOrder order = QOrder.order;
		QOrderItem orderItem = QOrderItem.orderItem;

		NumberExpression<Integer> returnsStatus = new CaseBuilder()
				.when(orderItem.orderStatus.notIn(OrderStatus.상품준비중, OrderStatus.배송중, OrderStatus.배송완료)).then(1)
				.otherwise(0);

		BooleanBuilder builder = new BooleanBuilder();

		// 사용자 이름 조건
		builder.and(order.user.username.eq(username).and(order.paymentStatus.eq(PaymentStatus.결제완료)
				.or(order.paymentStatus.eq(PaymentStatus.결제취소))));

		// 날짜 조건
		builder.and(orderItem.createdAt.between(sixMonthsAgoDate, todayDate));

		return jpaQueryFactory
				.select(Projections.constructor(OrderStatusSummaryDto.class,
						orderItem.orderStatus.when(OrderStatus.상품준비중).then(1).otherwise(0).sum(),
						orderItem.orderStatus.when(OrderStatus.배송중).then(1).otherwise(0).sum(),
						orderItem.orderStatus.when(OrderStatus.배송완료).then(1).otherwise(0).sum(), returnsStatus.sum()))
				.from(orderItem).leftJoin(order).on(order.orderIdx.eq(orderItem.orderIdx)).where(builder).fetchOne();
	}

	// 주문상세 조회
	public OrderDetailDto selectOrderDetail(Integer orderIdx) throws Exception {
		QOrder order = QOrder.order;
		QUser user = QUser.user;
		QCancel cancel = QCancel.cancel;
		QExchange exchange = new QExchange("exchange");
		QExchange exchangeSub = new QExchange("exchangeSub");
		QRefund refund = new QRefund("refund");
		QRefund refundSub = new QRefund("refundSub");
		QPayment payment = QPayment.payment;

		return jpaQueryFactory.select(Projections.fields(OrderDetailDto.class, order.orderIdx.as("orderIdx"),
				order.orderCode.as("orderCode"), order.createdAt.as("orderDate"),

				order.subtotalAmount.as("totalProductPrice"), order.shippingAmount.as("totalDeliveryFee"),
				payment.totalAmount.as("totalPaymentPrice"), payment.method.as("paymentMethod"),

				user.name.as("ordererName"), user.phone.as("ordererPhone"),

				order.postRecipient.as("receiverName"), order.phone.as("receiverPhone"),
				order.postZonecode.as("postCode"), order.postAddr1.as("address1"), order.postAddr2.as("address2"),
				order.postNote.as("deliveryMessage"),

				Projections
						.fields(OrderDetailDto.CancelInfo.class, cancel.cancelIdx.as("cancelIdx"),
								cancel.cancelAmount.as("cancelAmount"), cancel.canceledAt.as("cancelDate"))
						.as("CancelInfo"),

				Projections.fields(OrderDetailDto.ExchangeInfo.class, exchange.exchangeIdx.as("exchangelIdx"),
						exchange.shippingChargeType.as("shippingChargeType"),
						exchange.roundShippingFee.as("roundShippingFee"),

						exchange.reasonType.as("reasonType"), exchange.reasonDetail.as("reasonDetail"),
						exchange.image1Idx.as("image1Idx"), exchange.image2Idx.as("image2Idx"),
						exchange.image3Idx.as("image3Idx"),

						exchange.reshipName.as("reshipName"), exchange.reshipPhone.as("reshipPhone"),
						exchange.reshipZipcode.as("reshipZipcode"), exchange.reshipAddr1.as("reshipAddr1"),
						exchange.reshipAddr2.as("reshipAddr2"), exchange.reshipPostMemo.as("reshipPostMemo"),

						exchange.pickupPostComp.as("pickupPostComp"), exchange.pickupTrackingNo.as("pickupTrackingNo"),
						exchange.reshipPostComp.as("reshipPostComp"), exchange.reshipTrackingNo.as("reshipTrackingNo"),

						exchange.createdAt.as("exchangeDate")).as("ExchangeInfo"),

				Projections.fields(OrderDetailDto.RefundInfo.class, refund.refundIdx.as("refundIdx"),
						refund.shippingChargeType.as("shippingChargeType"),
						refund.returnShippingFee.as("returnShippingFee"), refund.refundAmount.as("refundAmount"),

						refund.reasonType.as("reasonType"), refund.reasonDetail.as("reasonDetail"),
						refund.image1Idx.as("image1Idx"), refund.image2Idx.as("image2Idx"),
						refund.image3Idx.as("image3Idx"),

						refund.createdAt.as("refundDate")).as("RefundInfo")))
				.from(order).leftJoin(user).on(user.username.eq(order.user.username)).leftJoin(cancel)
				.on(cancel.paymentIdx.eq(order.paymentIdx)).leftJoin(exchange)
				.on(exchange.orderIdx.eq(order.orderIdx)
						.and(exchange.exchangeIdx.eq(JPAExpressions.select(exchangeSub.exchangeIdx.max())
								.from(exchangeSub).where(exchangeSub.orderIdx.eq(order.orderIdx)))))
				.leftJoin(refund)
				.on(refund.orderIdx.eq(order.orderIdx)
						.and(refund.refundIdx.eq(JPAExpressions.select(refundSub.refundIdx.max()).from(refundSub)
								.where(refundSub.orderIdx.eq(order.orderIdx)))))
				.leftJoin(payment).on(payment.paymentIdx.eq(order.paymentIdx)).where(order.orderIdx.eq(orderIdx))
				.fetchOne();

	}
}
