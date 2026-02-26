package com.zipddak.admin.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.AdminExpertListDto;
import com.zipddak.admin.dto.AdminMembershipListDto;
import com.zipddak.admin.dto.AdminRentalListDto;
import com.zipddak.admin.dto.AdminRequestExpertListDto;
import com.zipddak.admin.dto.AdminRequestSellerListDto;
import com.zipddak.admin.dto.AdminSaleListDto;
import com.zipddak.admin.dto.AdminSellerListDto;
import com.zipddak.admin.dto.AdminSettlementListDto;
import com.zipddak.admin.dto.AdminUserListDto;
import com.zipddak.admin.dto.RequestExpertInfoDto;
import com.zipddak.admin.dto.RequestSellerInfoDto;
import com.zipddak.admin.dto.ResponseAdminListDto;
import com.zipddak.dto.AdminPaymentListDto;
import com.zipddak.entity.Order.PaymentStatus;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QMembership;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QRental;
import com.zipddak.entity.QReportExpert;
import com.zipddak.entity.QReportSeller;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QSellerFile;
import com.zipddak.entity.QSettlement;
import com.zipddak.entity.QTool;
import com.zipddak.entity.QUser;
import com.zipddak.entity.Rental.RentalStatus;
import com.zipddak.entity.Settlement.SettlementState;
import com.zipddak.entity.Settlement.TargetType;
import com.zipddak.entity.User.UserRole;
import com.zipddak.entity.User.UserState;
import com.zipddak.util.PageInfo;

@Repository
public class AdminDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public ResponseAdminListDto userList(Integer state, Integer column, String keyword, Integer page) {

		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QUser user = QUser.user;

		BooleanBuilder where = new BooleanBuilder();

		
		
		where.and(user.role.eq(UserRole.USER));
		// 1️⃣ 상태 조건
		if (state != 1) { // 1 = 전체
		    UserState userState;

		    switch (state) {
		        case 2:
		            userState = UserState.ACTIVE;
		            break;
		        case 3:
		            userState = UserState.SUSPENDED;
		            break;
		        default:
		            userState = UserState.WITHDRAWN;
		            break;
		    }

		    where.and(user.state.eq(userState));
		}

		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
		    switch (column) {
		        case 2: // name
		            where.and(user.name.contains(keyword));
		            break;
		        case 3: // nickname
		            where.and(user.nickname.contains(keyword));
		            break;
		        case 4: // username
		            where.and(user.username.contains(keyword));
		            break;
		        case 5: // tel
		            where.and(user.phone.contains(keyword));
		            break;
		        default:
		            // all 검색
		            where.and(
		                user.name.contains(keyword)
		                    .or(user.nickname.contains(keyword))
		                    .or(user.username.contains(keyword))
		                    .or(user.phone.contains(keyword))
		            );
		            break;
		    }
		}

		// 3️⃣ count 쿼리
		JPAQuery<Long> userQuery = jpaQueryFactory
		    .select(user.count())
		    .from(user)
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
	    
	    List<AdminUserListDto> userList = jpaQueryFactory.select(Projections.bean(AdminUserListDto.class, 
	    			user.name,
	    			user.nickname,
	    			user.username,
	    			user.phone,
	    			user.createdate.as("createdAt"),
	    			user.state
	    		))
	    		.from(user)
	    		.where(where)
	    		.orderBy(user.createdate.desc())
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
		
		return new ResponseAdminListDto(userList, pageInfo);
	}

	public ResponseAdminListDto expertList(Integer major, Integer state, Integer column, String keyword, Integer page) {
		
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QUser user = QUser.user;
		QExpert expert = QExpert.expert;
		QCategory category = QCategory.category;
		QReportExpert report = QReportExpert.reportExpert;

		BooleanBuilder where = new BooleanBuilder();
		
		if(major != 0) {
			where.and(expert.mainServiceIdx.eq(major));
		}
		
		
		String stringState = null;
		switch(state) {
		case 2 : stringState = "ACTIVE"; break;
		case 3 : stringState = "STOPPED"; break;
		case 4 : stringState = "WAITING"; break;
		}
		
		if(stringState != null) where.and(expert.activityStatus.eq(stringState));
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
		    switch (column) {
		        case 2: // name
		            where.and(expert.activityName.contains(keyword));
		            break;
		        case 3: // nickname
		            where.and(user.username.contains(keyword));
		            break;
		        case 4: // username
		            where.and(user.phone.contains(keyword));
		            break;
		        default:
		            // all 검색
		            where.and(
		                user.name.contains(keyword)
		                    .or(expert.activityName.contains(keyword))
		                    .or(user.username.contains(keyword))
		                    .or(user.phone.contains(keyword))
		            );
		            break;
		    }
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> expertQuery = jpaQueryFactory
		    .select(expert.count())
		    .from(expert)
		    .leftJoin(user).on(user.username.eq(expert.user.username))
		    .where(where);
				
		Long totalCount = expertQuery.fetchOne();
		
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
		
	    List<AdminExpertListDto> expertList = jpaQueryFactory.select(Projections.bean(AdminExpertListDto.class,
	    			expert.expertIdx,
	    			user.name,
	    			expert.activityName,
	    			user.username,
	    			report.reportIdx.countDistinct().as("reportCount"),
	    			category.name.as("cateName"),
	    			user.phone,
	    			expert.createdAt,
	    			expert.activityStatus.as("state")
	    		))
	    		.from(expert)
	    		.leftJoin(user).on(expert.user.username.eq(user.username))
	    		.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
	    		.leftJoin(report).on(report.expertIdx.eq(expert.expertIdx))
	    		.where(where)
	    		.groupBy(expert.expertIdx, user.name, expert.activityName, user.username, category.name, user.phone, expert.createdAt, expert.activityStatus)
	    		.orderBy(expert.createdAt.desc())
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
		
		return new ResponseAdminListDto(expertList, pageInfo);
	}

	
	
	
	public ResponseAdminListDto sellerList(Integer productCode, Integer state, String keyword, Integer page) {
		
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QSeller seller = QSeller.seller;
		QReportSeller report = QReportSeller.reportSeller;
		
		BooleanBuilder where = new BooleanBuilder();
		
		if(productCode != 0) {
			// ,를 기준으로 찾음
			BooleanExpression categoryContains = Expressions.booleanTemplate(
				    "FIND_IN_SET({0}, {1}) > 0",
				    productCode,
				    seller.handleItemCateIdx
				);
			
			where.and(categoryContains);
		}
		
		
		String stringState = null;
		switch(state) {
		case 2 : stringState = "ACTIVE"; break;
		case 3 : stringState = "STOPPED"; break;
		case 4 : stringState = "WAITING"; break;
		}
		
		if(stringState != null) where.and(seller.activityStatus.eq(stringState));
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
			where.and(
                seller.brandName.contains(keyword)
                    .or(seller.user.username.contains(keyword))
                    .or(seller.ceoName.contains(keyword))
                    .or(seller.managerTel.contains(keyword))
            );
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> sellerQuery = jpaQueryFactory
		    .select(seller.count())
		    .from(seller)
		    .where(where);
				
		Long totalCount = sellerQuery.fetchOne();
		
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
	    
	    List<AdminSellerListDto> sellerList = jpaQueryFactory.select(Projections.bean(AdminSellerListDto.class, 
	    			seller.sellerIdx,
	    			seller.compName,
	    			seller.brandName,
	    			seller.user.username,
	    			seller.ceoName,
	    			report.reportIdx.countDistinct().as("reportCount"),
	    			seller.managerTel,
	    			seller.createdAt,
	    			seller.activityStatus.as("state")
	    		))
	    		.from(seller)
	    		.leftJoin(report).on(report.sellerUsername.eq(seller.user.username))
	    		.where(where)
	    		.groupBy(seller.sellerIdx)
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
	    
	    
		return new ResponseAdminListDto(sellerList, pageInfo);
	}

	
	
	public ResponseAdminListDto rentalList(Integer column, Integer state, String keyword, Integer page, String startDate,
			String endDate) {
		
		
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QRental rental = QRental.rental;
		QTool tool = QTool.tool;
		QUser borrower = new QUser("borrower");
		QUser owner = new QUser("owner");
		
		BooleanBuilder where = new BooleanBuilder();
		
		RentalStatus stringState = null;
		switch(state) {
		case 1 : stringState = RentalStatus.PRE; break;
		case 2 : stringState = RentalStatus.PAYED; break;
		case 3 : stringState = RentalStatus.DELIVERY; break;
		case 4 : stringState = RentalStatus.RENTAL; break;
		case 5 : stringState = RentalStatus.RETURN; break;
		}
		
		if(stringState != null) {
			where.and(rental.satus.eq(stringState));
		}
		
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
		    switch (column) {
		        case 2: // name
		            where.and(tool.name.contains(keyword));
		            break;
		        case 3: // nickname
		            where.and(owner.name.contains(keyword));
		            break;
		        case 4: // username
		            where.and(borrower.name.contains(keyword));
		            break;
		        default:
		            // all 검색
		            where.and(
		            		tool.name.contains(keyword)
		                    .or(owner.name.contains(keyword))
		                    .or(borrower.name.contains(keyword))
		            );
		            break;
		    }
		}
		

		if (startDate != null && !startDate.isBlank()) {
		    try {
		        Date start = Date.valueOf(startDate); // 문자열 → java.sql.Date
		        where.and(rental.startDate.goe(start)); // startDate 이후
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		}

		if (endDate != null && !endDate.isBlank()) {
		    try {
		        Date end = Date.valueOf(endDate); // 문자열 → java.sql.Date
		        where.and(rental.endDate.loe(end)); // endDate 이전
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> rentalQuery = jpaQueryFactory
			    .select(rental.count())
			    .from(rental)
			    .leftJoin(tool).on(rental.tool.toolIdx.eq(tool.toolIdx))
			    .leftJoin(owner).on(rental.owner.eq(owner.username))
			    .leftJoin(borrower).on(rental.borrower.eq(borrower.username))
			    .where(where);
				
		Long totalCount = rentalQuery.fetchOne();
		
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
	    
	    List<AdminRentalListDto> rentalList = jpaQueryFactory.select(Projections.bean(AdminRentalListDto.class, 
	    			rental.rentalIdx,
	    			tool.name.as("toolName"),
	    			owner.name.as("owner"),
	    			borrower.name.as("borrower"),
	    			rental.startDate,
	    			rental.endDate,
	    			rental.satus.as("state")
	    		)) 
	    		.from(rental)
	    		.leftJoin(tool).on(rental.tool.toolIdx.eq(tool.toolIdx))
	    		.leftJoin(owner).on(rental.owner.eq(owner.username))
	    		.leftJoin(borrower).on(rental.borrower.eq(borrower.username))
	    		.where(where)
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
		
		return new ResponseAdminListDto(rentalList, pageInfo);
	}

	
	public ResponseAdminListDto saleList(Integer column, Integer state, String keyword, Integer page, String startDate,
			String endDate) {
	
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QOrder order = QOrder.order;
		QUser buyer = new QUser("buyer");
		
		BooleanBuilder where = new BooleanBuilder();
		
		PaymentStatus stringState = null;
		switch(state) {
		case 1 : stringState = PaymentStatus.결제완료; break;
		case 2 : stringState = PaymentStatus.결제취소; break;
		}
		
		if(stringState != null) {
			where.and(order.paymentStatus.eq(stringState));
		}
		
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
		    switch (column) {
		        case 2: // 주문ID
		            where.and(order.orderIdx.stringValue().contains(keyword));
		            break;
		        case 3: // 주문코드
		            where.and(order.orderCode.contains(keyword));
		            break;
		        case 4: // 구매자
		            where.and(buyer.name.contains(keyword));
		            break;
		        default:
		            // all 검색
		            where.and(
		            		order.orderIdx.stringValue().contains(keyword)
		                    .or(order.orderCode.contains(keyword))
		                    .or(buyer.name.contains(keyword))
		            );
		            break;
		    }
		}
		

		if (startDate != null && !startDate.isBlank()) {
		    try {
		        Date start = Date.valueOf(startDate); // 문자열 → java.sql.Date
		        where.and(order.createdAt.goe(start)); // startDate 이후
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		}

		if (endDate != null && !endDate.isBlank()) {
		    try {
		        Date end = Date.valueOf(endDate); // 문자열 → java.sql.Date
		        where.and(order.createdAt.loe(end)); // endDate 이전
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> orderQuery = jpaQueryFactory
			    .select(order.count())
			    .from(order)
			    .leftJoin(buyer).on(order.user.username.eq(buyer.username))
			    .where(where);
				
		Long totalCount = orderQuery.fetchOne();
		
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
	    
	    List<AdminSaleListDto> saleList = jpaQueryFactory.select(Projections.bean(AdminSaleListDto.class, 
	    			order.orderIdx,
	    			order.orderCode,
	    			buyer.name.as("buyer"),
	    			order.postRecipient.as("recv"),
	    			order.totalAmount.as("amount"),
	    			order.createdAt,
	    			order.paymentStatus.as("state")
	    		))
	    		.from(order)
	    		.leftJoin(buyer).on(order.user.username.eq(buyer.username))
	    		.where(where)
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
	    
		return new ResponseAdminListDto(saleList, pageInfo);
	}

	public ResponseAdminListDto paymentList(Integer type, Integer state, String keyword, Integer page) {
	
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QPayment payment = QPayment.payment;
		
		BooleanBuilder where = new BooleanBuilder();
		
		PaymentType paymentType = null;
		
		switch(type) {
		case 2 : paymentType = PaymentType.RENTAL; break;
		case 3 : paymentType = PaymentType.MATCHING; break;
		case 4 : paymentType = PaymentType.ORDER; break;
		case 5 : paymentType = PaymentType.MEMBERSHIP; break;
		}
		
		if(paymentType != null) {
			where.and(payment.paymentType.eq(paymentType));
		}
		
		String stringState = null;
		switch(state) {
		case 1 : stringState = "DONE"; break;
		case 2 : stringState = "CANCELED"; break;
		}
		
		 where.and(payment.status.eq(stringState));
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
			where.and(
                payment.paymentIdx.stringValue().contains(keyword)
                    .or(payment.orderId.contains(keyword))
                    .or(payment.orderName.contains(keyword))
            );
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> paymentQuery = jpaQueryFactory
		    .select(payment.count())
		    .from(payment)
		    .where(where);
				
		Long totalCount = paymentQuery.fetchOne();
		
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
		
	    List<AdminPaymentListDto> paymentList = jpaQueryFactory.select(Projections.bean(AdminPaymentListDto.class, 
	    			payment.paymentIdx,
	    			payment.orderId,
	    			payment.orderName,
	    			payment.approvedAt,
	    			payment.method,
	    			payment.totalAmount.as("amount"),
	    			payment.status.as("state")
	    		))
	    		.from(payment)
	    		.where(where)
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
	    
		return new ResponseAdminListDto(paymentList, pageInfo);
	}

	public ResponseAdminListDto membershipList(Integer state, String keyword, Integer page) {

		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QMembership membership = QMembership.membership;
		QExpert expert = QExpert.expert;
		QPayment payment = QPayment.payment;
		
		// state == 1 -> 활성상태 멤버십이 진행중
		// state == 2 -> 만료상태 멤버십 endDate가 지남
		
		BooleanBuilder where = new BooleanBuilder();
		
		Date now = new Date(System.currentTimeMillis());
		
		if(state == 1) {
			where.and(membership.endDate.goe(now));
		}else if( state == 2) {
			where.and(membership.endDate.lt(now));
		}
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
			System.out.println("-------------------------------------");
			System.out.println(keyword);
			where.and(
                expert.activityName.contains(keyword)
                    .or(expert.user.username.contains(keyword))
            );
		}
		
		// 3️⃣ count 쿼리
		Long totalCount = jpaQueryFactory
			    .select(membership.count())
			    .from(membership)
			    .leftJoin(expert).on(membership.username.eq(expert.user.username))
			    .where(where)
			    .fetchOne();
		
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
		
		
		List<AdminMembershipListDto> membershipList = jpaQueryFactory.select(Projections.bean(AdminMembershipListDto.class, 
					membership.membershipIdx,
					expert.user.username,
					expert.activityName,
					membership.startDate.as("startDate"),
					payment.approvedAt.as("paymentDate"),
					membership.endDate.as("endDate")
				))
				.from(membership)
				.leftJoin(expert).on(membership.username.eq(expert.user.username))
				.leftJoin(payment).on(membership.paymentIdx.eq(payment.paymentIdx))
				.where(where)
				.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
		
		return new ResponseAdminListDto(membershipList, pageInfo);
		
	}

	
	public ResponseAdminListDto requestExpertList(Integer state, Integer column, String keyword, Integer page) {
	
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QExpert expert = QExpert.expert;
		QUser user = QUser.user;
		QCategory category = QCategory.category;
		
		BooleanBuilder where = new BooleanBuilder();
		
		String stringState = null;
		switch(state) {
		case 1 : stringState = "WAITING"; break;
		case 2 : stringState = "REJECT"; break;
		}
		
		if(stringState != null) where.and(expert.activityStatus.eq(stringState));
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
		    switch (column) {
		        case 2: // 신청자
		            where.and(user.name.contains(keyword));
		            break;
		        case 3: // 전화번호
		            where.and(user.phone.contains(keyword));
		            break;
		        case 4: // 사업자번호
		            where.and(expert.businessLicense.contains(keyword));
		            break;
		        default:
		            // all 검색
		            where.and(
		            		user.name.contains(keyword)
		                    .or(user.phone.contains(keyword))
		                    .or(expert.businessLicense.contains(keyword))
		            );
		            break;
		    }
		    
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> requestExpertQuery = jpaQueryFactory
		    .select(expert.count())
		    .from(expert)
		    .leftJoin(user).on(expert.user.username.eq(user.username))
		    .leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
		    .where(where);
				
		Long totalCount = requestExpertQuery.fetchOne();
		
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
	    
	    List<AdminRequestExpertListDto> requestExpertList = jpaQueryFactory.select(Projections.bean(AdminRequestExpertListDto.class, 
	    			user.username,
	    			user.name,
	    			user.phone,
	    			expert.businessLicense,
	    			category.name.as("mainService"),
	    			expert.employeeCount,
	    			expert.createdAt,
	    			expert.expertIdx,
	    			expert.activityStatus
	    		))
	    		.from(expert)
	    		.leftJoin(user).on(expert.user.username.eq(user.username))
	    		.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
	    		.where(where)
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
		
		return new ResponseAdminListDto(requestExpertList, pageInfo);
	}

	
	public ResponseAdminListDto requestSellerList(Integer state, Integer column, String keyword, Integer page) {
	
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;
		
		QSeller seller = QSeller.seller;
		
		BooleanBuilder where = new BooleanBuilder();
		
		String stringState = null;
		switch(state) {
		case 1 : stringState = "WAITING"; break;
		case 2 : stringState = "REJECT"; break;
		}
		
		if(stringState != null) where.and(seller.activityStatus.eq(stringState));
		
		// 2️⃣ 검색 조건
		if (keyword != null && !keyword.isBlank()) {
		    switch (column) {
		        case 2: // 회사명
		            where.and(seller.compName.contains(keyword));
		            break;
		        case 3: // 브랜드명
		            where.and(seller.brandName.contains(keyword));
		            break;
		        case 4: // 대표자
		            where.and(seller.ceoName.contains(keyword));
		            break;
		        case 5: // 전화번호
		            where.and(seller.managerTel.contains(keyword));
		            break;
		        case 6: // 사업자번호
		            where.and(seller.compBno.contains(keyword));
		            break;
		        default:
		            // all 검색
		            where.and(
		            		seller.compName.contains(keyword)
		                    .or(seller.brandName.contains(keyword))
		                    .or(seller.ceoName.contains(keyword))
		                    .or(seller.managerTel.contains(keyword))
		                    .or(seller.compBno.contains(keyword))
		                    
		            );
		            break;
		    }
		    
		}
		
		// 3️⃣ count 쿼리
		JPAQuery<Long> requestExpertQuery = jpaQueryFactory
		    .select(seller.count())
		    .from(seller)
		    .where(where);
				
		Long totalCount = requestExpertQuery.fetchOne();
		
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
		
	    List<AdminRequestSellerListDto> requestSellerList = jpaQueryFactory.select(Projections.bean(AdminRequestSellerListDto.class,
	    			seller.sellerIdx,
	    			seller.compName,
	    			seller.brandName,
	    			seller.ceoName,
	    			seller.managerTel,
	    			seller.compBno,
	    			seller.compHp,
	    			seller.activityStatus,
	    			seller.createdAt
	    		))
	    		.from(seller)
	    		.where(where)
	    		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
	    		
	    
	    return new ResponseAdminListDto(requestSellerList, pageInfo);
	}

	// 전문가 상세
	public RequestExpertInfoDto expertInfo(Integer expertIdx) {
		
		QExpert expert = QExpert.expert;
		QUser user = QUser.user;
		QExpertFile file = QExpertFile.expertFile;
		
		return jpaQueryFactory.select(Projections.bean(RequestExpertInfoDto.class, 
					user.name,
					expert.activityName,
					expert.employeeCount,
					expert.businessLicense,
					file.fileRename.as("businessPdfFile"),
					file.storagePath.as("fileStoragePath"),
					expert.settleBank.as("bank"),
					expert.settleAccount.as("account"),
					expert.settleHost.as("host"),
					expert.providedServiceIdx.as("serviceString")
				))
				.from(expert)
				.leftJoin(user).on(expert.user.username.eq(user.username))
				.leftJoin(file).on(expert.businessLicensePdfId.eq(file.expertFileIdx))
				.where(expert.expertIdx.eq(expertIdx))
				.fetchOne();
	}

	// 전문가 제공 서비스
	public String expertService(Integer categoryIdx) {

		QCategory category = QCategory.category;
		
		return jpaQueryFactory
				.select(category.name)
				.from(category)
				.where(category.categoryIdx.eq(categoryIdx))
				.fetchOne();
	}

	public RequestSellerInfoDto sellerInfo(Integer sellerIdx) {

		QSeller seller = QSeller.seller;
		QSellerFile file = QSellerFile.sellerFile;
		
		return jpaQueryFactory.select(Projections.bean(RequestSellerInfoDto.class, 
					seller.compName,
					seller.brandName,
					seller.ceoName,
					seller.managerTel.as("phone"),
					file.fileRename.as("businessLicense"),
					seller.settleAccount.as("account"),
					seller.settleBank.as("bank"),
					seller.settleHost.as("host"),
					seller.handleItemCateIdx.as("itemIdxs")
				))
				.from(seller)
				.leftJoin(file).on(file.sellerFileIdx.eq(seller.compFileIdx))
				.where(seller.sellerIdx.eq(sellerIdx))
				.fetchOne();
				
	}
	
	public ResponseAdminListDto settlementList(Integer type, String month, Integer state, Integer page) {
		
		int itemsPerPage = 15; 
		int buttonsPerPage = 5;

		QSettlement settlement = QSettlement.settlement;
		QUser user = QUser.user;
		
		BooleanBuilder where = new BooleanBuilder();
		
		SettlementState stringState = null;
		switch(state) {
		case 1 : stringState = SettlementState.PENDING; break;
		case 2 : stringState = SettlementState.COMPLETED; break;
		}
		
		if(stringState != null) where.and(settlement.state.eq(stringState));
		
		TargetType targetType = null;
		switch(type) {
		case 1 : targetType = TargetType.EXPERT; break;
		case 2 : targetType = TargetType.SELLER; break;
		}
		
		if(targetType != null) where.and(settlement.targetType.eq(targetType));
		
		YearMonth ym = YearMonth.parse(month); // "YYYY-MM"
        LocalDate startLocal = ym.atDay(1); // 월 첫째 날
        LocalDate endLocal = ym.atEndOfMonth(); // 월 마지막 날

        Date start = Date.valueOf(startLocal);
        Date end = Date.valueOf(endLocal);

        where.and(settlement.settlementMonth.goe(start)
                 .and(settlement.settlementMonth.loe(end)));
        
	     // 3️⃣ count 쿼리
		JPAQuery<Long> requestExpertQuery = jpaQueryFactory
		    .select(settlement.count())
		    .from(settlement)
		    .where(where);
				
		Long totalCount = requestExpertQuery.fetchOne();
		
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

        
        List<AdminSettlementListDto> settlementList = jpaQueryFactory.select(Projections.bean(AdminSettlementListDto.class, 
        			settlement.settlementIdx,
        			user.username,
        			user.name,
        			settlement.amount.as("totalAmount"),
        			settlement.feeRate,
        			settlement.settlementAmount.as("settlementTotalAmount"),
        			settlement.state
        		))
        		.from(settlement)
        		.leftJoin(user).on(settlement.targetUsername.eq(user.username))
        		.where(where)
        		.offset((page - 1) * itemsPerPage)
	    		.limit(itemsPerPage)
	    		.fetch();
        
		return new ResponseAdminListDto(settlementList, pageInfo);
	}

	public AdminSettlementListDto settlementDetail(Integer settlementIdx) {
		
		QSettlement settlement = QSettlement.settlement;
		QUser user = QUser.user;
		
		return jpaQueryFactory.select(Projections.bean(AdminSettlementListDto.class, 
    			settlement.settlementIdx,
    			user.username,
    			user.name,
    			settlement.amount.as("totalAmount"),
    			settlement.feeRate,
    			settlement.settlementAmount.as("settlementTotalAmount"),
    			settlement.state,
    			settlement.targetType.as("userType"),
    			settlement.settlementMonth.as("month")
    		))
    		.from(settlement)
    		.leftJoin(user).on(settlement.targetUsername.eq(user.username))
    		.where(settlement.settlementIdx.eq(settlementIdx))
    		.fetchOne();
	}

	
}

