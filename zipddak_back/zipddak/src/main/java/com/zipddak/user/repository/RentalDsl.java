package com.zipddak.user.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QRental;
import com.zipddak.entity.QSettlement;
import com.zipddak.entity.QTool;
import com.zipddak.entity.QToolFile;
import com.zipddak.entity.QUser;
import com.zipddak.entity.Rental.RentalStatus;
import com.zipddak.user.dto.BorrowPaymentDto;
import com.zipddak.user.dto.BorrowRentalDto;
import com.zipddak.user.dto.BorrowSettlementDto;
import com.zipddak.user.dto.BorrowToolDto;
import com.zipddak.user.dto.RentalDetailDto;
import com.zipddak.user.dto.ResponseRentalDetailListDto;
import com.zipddak.util.PageInfo;

@Repository
public class RentalDsl {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public ResponseRentalDetailListDto rentalList(String username, Integer rentalCate, String startDate, String endDate,
			Integer state, Integer page) {
		

		int itemsPerPage = 4; 
		int buttonsPerPage = 5;
	
		QRental rental = QRental.rental;
		QTool tool = QTool.tool;
		QToolFile file = QToolFile.toolFile;
		QPayment payment = QPayment.payment;
		QUser user = QUser.user;
		
		BooleanBuilder where = new BooleanBuilder();
		
		if(!startDate.equals("")) {
			
			Date sDate = Date.valueOf(startDate); 
			
			where.and(rental.startDate.goe(sDate));
		}
		
		if(!endDate.equals("")) {
			Date eDate = Date.valueOf(endDate);
			
			where.and(rental.endDate.loe(eDate));
		}
		
		RentalStatus rentalState = null;
		
		switch(state) {
		case 2 : rentalState = RentalStatus.PAYED; break;
		case 3 : rentalState = RentalStatus.DELIVERY; break;
		case 4 : rentalState = RentalStatus.RENTAL; break;
		case 5 : rentalState = RentalStatus.RETURN; break;
		}
		
		if(rentalState != null) {
			where.and(rental.satus.eq(rentalState));
		}else {
			where.and(rental.satus.ne(RentalStatus.PRE));
		}
		
		JPAQuery<Long> userQuery = jpaQueryFactory
		    .select(rental.count())
		    .from(rental)
			.leftJoin(tool).on(rental.tool.toolIdx.eq(tool.toolIdx))
			.leftJoin(file).on(tool.thunbnail.eq(file.toolFileIdx))
			.leftJoin(payment).on(rental.rentalCode.eq(payment.orderId))
			.where(where);

		Long totalCount = userQuery.fetchOne();
		
		 // 2. 페이징 계산
	    int allPage = (int) Math.ceil((double) totalCount / itemsPerPage);

	    int startPage = ((page - 1) / buttonsPerPage) * buttonsPerPage + 1;
	    int endPage = Math.min(startPage + buttonsPerPage - 1, allPage);

	    // 4. PageInfo 세팅
	    PageInfo pageInfo = new PageInfo();
	    pageInfo.setCurPage(page);
	    pageInfo.setAllPage(allPage);
	    pageInfo.setStartPage(startPage);
	    pageInfo.setEndPage(endPage);
		
		List<RentalDetailDto> responseList = null;
		
		// 빌린 공구
		if(rentalCate == 1) {
			
			responseList = jpaQueryFactory.select(Projections.bean(RentalDetailDto.class, 
						tool.toolIdx,
						rental.rentalIdx,
						file.fileRename.as("toolImg"),
						tool.name.as("toolName"),
						rental.startDate,
						rental.endDate,
						payment.totalAmount.as("amount"),
						rental.satus.as("state"),
						rental.reviewCheck.as("reviewCheck"),
						rental.postComp.as("postComp"),
						rental.trackingNo.as("invoice")
						
					))
					.from(rental)
					.leftJoin(tool).on(rental.tool.toolIdx.eq(tool.toolIdx))
					.leftJoin(file).on(file.toolFileIdx.eq(tool.thunbnail))
					.leftJoin(payment).on(rental.rentalCode.eq(payment.orderId))
					.where(where.and(rental.borrower.eq(username)))
					.orderBy(rental.createdAt.desc())
					.offset((page - 1) * itemsPerPage)
		    		.limit(itemsPerPage)
		    		.fetch();
			
		}else {
			// 빌려준 공구
			responseList = jpaQueryFactory.select(Projections.bean(RentalDetailDto.class, 
					tool.toolIdx,
					rental.rentalIdx,
					file.fileRename.as("toolImg"),
					tool.name.as("toolName"),
					rental.startDate,
					rental.endDate,
					payment.totalAmount.as("amount"),
					rental.satus.as("state"),
					user.nickname.as("borrowName"),
					rental.postComp.as("postComp"),
					rental.trackingNo.as("invoice")
				))
				.from(rental)
				.leftJoin(tool).on(rental.tool.toolIdx.eq(tool.toolIdx))
				.leftJoin(file).on(file.toolFileIdx.eq(tool.thunbnail))
				.leftJoin(payment).on(rental.rentalCode.eq(payment.orderId))
				.leftJoin(user).on(rental.borrower.eq(user.username))
				.where(where.and(rental.owner.eq(username)))
				.orderBy(rental.createdAt.desc())
				.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
		}
		
		
		return new ResponseRentalDetailListDto(responseList, pageInfo);
	}

	public BorrowToolDto borrowTool(Integer rentalIdx) {

		QTool tool = QTool.tool;
		QToolFile file = QToolFile.toolFile;
		QRental rental = QRental.rental;
		QUser user = QUser.user;
		
		return jpaQueryFactory.select(Projections.bean(BorrowToolDto.class, 
					file.fileRename.as("toolImg"),
					tool.name.as("toolName"),
					tool.addr1,
					tool.addr2,
					user.name.as("ownerName"),
					user.phone.as("ownerPhone"),
					tool.rentalPrice.as("oneDayAmount")
				))
				.from(rental)
				.leftJoin(tool).on(tool.toolIdx.eq(rental.tool.toolIdx))
				.leftJoin(file).on(file.toolFileIdx.eq(tool.thunbnail))
				.leftJoin(user).on(user.username.eq(tool.owner))
				.where(rental.rentalIdx.eq(rentalIdx))
				.fetchOne();
	}

	public BorrowRentalDto borrowRental(Integer rentalIdx) {

		QRental rental = QRental.rental;
		
		return jpaQueryFactory.select(Projections.bean(BorrowRentalDto.class, 
					rental.satus.as("state"),
					rental.startDate,
					rental.endDate,
					// 대여 기간이라서 당일 대여면 1일로 쳐야함
					Expressions.numberTemplate(Integer.class, 
						"DATEDIFF({0},{1})",
						rental.endDate,
						rental.startDate).as("dateDiff"),
					rental.postCharge,
					rental.postRental,
					rental.directRental,
					rental.name.as("recvName"),
					rental.phone.as("recvPhone"),
					rental.addr1,
					rental.addr2
				))
				.from(rental)
				.where(rental.rentalIdx.eq(rentalIdx))
				.fetchOne();
	}

	public BorrowPaymentDto borrowPayment(Integer rentalIdx) {
	
		QPayment payment = QPayment.payment;
		QRental rental = QRental.rental;
		
		return jpaQueryFactory.select(Projections.bean(BorrowPaymentDto.class, 
					payment.method,
					payment.totalAmount,
					payment.approvedAt.as("appAt")
				))
				.from(rental)
				.leftJoin(payment).on(payment.orderId.eq(rental.rentalCode))
				.where(rental.rentalIdx.eq(rentalIdx))
				.fetchOne();
	}

	public BorrowSettlementDto borrowSettlement(Integer rentalIdx) {

		QRental rental = QRental.rental;
		QSettlement settlement = QSettlement.settlement;
		QPayment payment = QPayment.payment;
		QUser user = QUser.user;
		
		return jpaQueryFactory.select(Projections.bean(BorrowSettlementDto.class, 
					settlement.completedAt,
					payment.totalAmount,
					settlement.feeRate,
					user.settleAccount.as("account"),
					user.settleBank.as("bank"),
					user.settleHost.as("host"),
					settlement.state,
					settlement.settlementAmount.as("money")
				))
				.from(rental)
				.leftJoin(settlement).on(settlement.settlementIdx.eq(rental.settlementIdx))
				.leftJoin(payment).on(payment.orderId.eq(rental.rentalCode))
				.leftJoin(user).on(user.username.eq(rental.owner))
				.where(rental.rentalIdx.eq(rentalIdx))
				.fetchOne();
	}
	
}
