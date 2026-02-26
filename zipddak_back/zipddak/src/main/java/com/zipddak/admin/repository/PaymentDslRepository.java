package com.zipddak.admin.repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.SettlementsTargetListDto;
import com.zipddak.dto.SettlementSellerTargetListDto;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QUser;
import com.zipddak.entity.Payment;
import com.zipddak.entity.Payment.PaymentType;

@Repository
public class PaymentDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	// 전문가에 대한 해당 년/월에 결제된 모든 결제 목록을 불러오기
	public List<SettlementsTargetListDto> expertSettlementsTarget(YearMonth month) {
		QPayment payment = QPayment.payment;
		
		LocalDateTime startLdt = month.atDay(1).atStartOfDay();
		LocalDateTime endLdt   = month.plusMonths(1).atDay(1).atStartOfDay();

		// 2️⃣ LocalDateTime → Timestamp 변환
		Timestamp start = Timestamp.valueOf(startLdt);
		Timestamp end   = Timestamp.valueOf(endLdt);
		
		return jpaQueryFactory.select(Projections.bean(SettlementsTargetListDto.class, 
					
					payment.sellUsername.as("username"),
					payment.sellUserType.as("userType"),
					payment.paymentType,
					payment.count().as("totalCount"),
					payment.totalAmount.sum().as("totalAmount")
				
				))
				.from(payment)
				.where(payment.approvedAt.goe(start),
						payment.approvedAt.lt(end),
						payment.status.eq("DONE"),
						payment.paymentType.eq(PaymentType.MATCHING)
					)
				.groupBy(payment.sellUsername, payment.sellUserType)
				.fetch();
	}

	// 판매업체에 대한 해당 년/월에 결제된 모든 결제 목록을 불러오기
	public List<SettlementSellerTargetListDto> sellerSettlementsTarget(YearMonth month) {
		
		QOrderItem item = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		
		LocalDateTime startLdt = month.atDay(1).atStartOfDay();
		LocalDateTime endLdt   = month.plusMonths(1).atDay(1).atStartOfDay();

		// 변환
		java.sql.Date start = new java.sql.Date(startLdt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
		java.sql.Date end   = new java.sql.Date(endLdt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		
		return jpaQueryFactory.select(Projections.bean(SettlementSellerTargetListDto.class, 
					seller.user.username,
					seller.basicPostCharge,
					seller.freeChargeAmount,
					product.postType,
					product.postCharge,
					item.unitPrice.multiply(item.quantity).sum().as("totalAmount"),
			        item.quantity.sum().as("totalQuantity")
				))
				.from(item)
				.leftJoin(product).on(item.product.productIdx.eq(product.productIdx))
				.leftJoin(seller).on(product.sellerUsername.eq(seller.user.username))
				.where(item.createdAt.goe(start),
						item.createdAt.lt(end)
					)
				.groupBy(seller.user.username, product.postType, seller.basicPostCharge, seller.freeChargeAmount, product.postCharge)
				.fetch();
				
	}
	
}
