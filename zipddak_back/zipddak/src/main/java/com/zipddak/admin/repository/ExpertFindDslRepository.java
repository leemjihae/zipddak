package com.zipddak.admin.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.EstimatePaymentExpertDto;
import com.zipddak.admin.dto.ExpertCardDto;
import com.zipddak.admin.dto.ExpertProfileDto;
import com.zipddak.admin.dto.ExpertReviewDetailDto;
import com.zipddak.admin.dto.ExpertReviewScoreDto;
import com.zipddak.admin.dto.ResponseReviewListAndHasnext;
import com.zipddak.entity.QCareer;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QMembership;
import com.zipddak.entity.QPayment;
import com.zipddak.entity.QProfileFile;
import com.zipddak.entity.QReviewExpert;
import com.zipddak.entity.QReviewFile;
import com.zipddak.entity.QUser;

@Repository
public class ExpertFindDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public List<ExpertCardDto> experts(PageRequest pageRequest, Integer categoryNo, String keyword, String sort) {
			
		QCategory category = QCategory.category;
		QExpert expert = QExpert.expert;
		QExpertFile file = QExpertFile.expertFile;
		QMatching matching = QMatching.matching;
		QReviewExpert review = QReviewExpert.reviewExpert;
		QCareer career = QCareer.career;
		
		// career months 합계를 expert 기준으로 가져오는 Expression
		NumberExpression<Integer> careerSumExpr = Expressions.numberTemplate(Integer.class,
		    "(select coalesce(sum(c2.months), 0) from Career c2 where c2.expertIdx = {0})",
		    expert.expertIdx
		);
		
		BooleanBuilder builder = new BooleanBuilder();

		builder.and(expert.activityStatus.eq("ACTIVE"));
		
		// 카테고리 필터
		switch(categoryNo) {
		    case 23 : builder.and(expert.mainServiceIdx.gt(22).and(expert.mainServiceIdx.lt(44))); break;
		    case 44 : builder.and(expert.mainServiceIdx.gt(43).and(expert.mainServiceIdx.lt(74))); break;
		    case 74 : builder.and(expert.mainServiceIdx.eq(75)); break;
		}
		
		// where절 만들기
		if(keyword != null && !keyword.isEmpty()) {
		    BooleanBuilder keywordBuilder = new BooleanBuilder();
		    keywordBuilder.or(expert.activityName.contains(keyword));
		    keywordBuilder.or(category.name.contains(keyword));
		    keywordBuilder.or(expert.introduction.contains(keyword));

		    builder.and(keywordBuilder); // 모든 OR 조건을 AND로 묶음
		}
		
		// order절 만들기
		OrderSpecifier<?> order = null;
		
		switch(sort) {
		case "popular" : order = matching.expertIdx.count().desc(); break;
		case "rating" : order = review.score.avg().desc(); break;
		case "career" : order = Expressions.numberTemplate(Integer.class,
								"SUM(DATEDIFF({0}, {1}))",
								career.endDate,
								career.startDate).desc(); break;
		}
		
		OrderSpecifier<?> secondOrder = expert.expertIdx.desc();
		
		return jpaQueryFactory.select(Projections.bean(ExpertCardDto.class, 
				expert.expertIdx,
				expert.addr1,
				expert.addr2,
				file.fileRename.as("imgFileRename"),
				file.storagePath.as("imgStoragePath"),
				expert.activityName,
				expert.mainServiceIdx,
				category.name.as("mainServiceName"),
				Expressions.numberTemplate(Double.class,
											"COALESCE(ROUND({0}, 1), 0)",  // null이면 0으로 대체
											review.score.avg()).as("avgRating"),
				review.reviewExpertIdx.countDistinct().as("reviewCount"),
				expert.introduction,
				matching.matchingIdx.countDistinct().as("matchingCount"),
				careerSumExpr.as("career")
						))
				.from(expert)
				.leftJoin(file).on(expert.profileImageIdx.eq(file.expertFileIdx))
				.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
				.leftJoin(matching).on(expert.expertIdx.eq(matching.expertIdx))
				.leftJoin(review).on(expert.expertIdx.eq(review.expertIdx))
				.leftJoin(career).on(expert.expertIdx.eq(career.expertIdx))
				.where(builder)
				.groupBy(expert.expertIdx, expert.addr1, expert.addr2, file.fileRename, file.storagePath, expert.activityName,
						expert.mainServiceIdx, category.name, expert.introduction)
				.orderBy(order, secondOrder)
				.offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize())
				.fetch();
		}

	public List<ExpertCardDto> addExperts(Integer categoryNo) {
	
		QCategory category = QCategory.category;
		QExpert expert = QExpert.expert;
		QExpertFile file = QExpertFile.expertFile;
		QMatching matching = QMatching.matching;
		QReviewExpert review = QReviewExpert.reviewExpert;
		QCareer career = QCareer.career;
		
		QMembership membership = QMembership.membership;
		QPayment payment = QPayment.payment;

		NumberExpression<Integer> careerSumExpr = Expressions.numberTemplate(Integer.class,
			    "(select coalesce(sum(c2.months), 0) from Career c2 where c2.expertIdx = {0})",
			    expert.expertIdx
			);
		
		BooleanBuilder builder = new BooleanBuilder();

		Date now = new Date(System.currentTimeMillis());
		
		builder.and(membership.endDate.goe(now));
		
		// 카테고리 필터
		switch(categoryNo) {
		    case 23 : builder.and(expert.mainServiceIdx.gt(22).and(expert.mainServiceIdx.lt(44))); break;
		    case 44 : builder.and(expert.mainServiceIdx.gt(43).and(expert.mainServiceIdx.lt(74))); break;
		    case 74 : builder.and(expert.mainServiceIdx.eq(75)); break;
		}
		
		// 멤버십 종료일도 넣기
//		builder.and(builder)
		
		
		return jpaQueryFactory.select(Projections.bean(ExpertCardDto.class, 
				expert.expertIdx,
				expert.addr1,
				expert.addr2,
				file.fileRename.as("imgFileRename"),
				file.storagePath.as("imgStoragePath"),
				expert.activityName,
				expert.mainServiceIdx,
				category.name.as("mainServiceName"),
				Expressions.numberTemplate(Double.class,
											"COALESCE(ROUND({0}, 1), 0)",  // null이면 0으로 대체
											review.score.avg()).as("avgRating"),
				review.reviewExpertIdx.countDistinct().as("reviewCount"),
				expert.introduction,
				matching.matchingIdx.countDistinct().as("matchingCount"),
				careerSumExpr.as("career")
						))
				.from(expert)
				.leftJoin(file).on(expert.profileImageIdx.eq(file.expertFileIdx))
				.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
				.leftJoin(matching).on(expert.expertIdx.eq(matching.expertIdx))
				.leftJoin(review).on(expert.expertIdx.eq(review.expertIdx))
				.leftJoin(career).on(expert.expertIdx.eq(career.expertIdx))
				.leftJoin(membership).on(expert.user.username.eq(membership.username))
				.leftJoin(payment).on(membership.paymentIdx.eq(payment.paymentIdx))
				.where(builder)
				.groupBy(expert.expertIdx, expert.addr1, expert.addr2, file.fileRename, file.storagePath, expert.activityName,
						expert.mainServiceIdx, category.name, expert.introduction)
				.orderBy(payment.approvedAt.desc())
		        .limit(3)
				.fetch();
		
	}

	// 전문가 프로필 구하기
	public ExpertProfileDto expertProfile(Integer expertIdx) {

		QExpert expert = QExpert.expert;
		QExpertFile profile = new QExpertFile("profile");
		QExpertFile cert1 = new QExpertFile("cert1");
		QExpertFile cert2 = new QExpertFile("cert2");
		QExpertFile cert3 = new QExpertFile("cert3");
		QCategory category = QCategory.category;
		
		return jpaQueryFactory.select(Projections.bean(ExpertProfileDto.class,
						expert.activityName,
						expert.expertIdx,
						profile.fileRename.as("imgFileRename"),
						profile.storagePath.as("imgStoragePath"),
						expert.mainServiceIdx,
						category.name.as("mainServiceName"),
						expert.introduction,
						expert.addr1,
						expert.addr2,
						expert.employeeCount,
						expert.contactStartTime,
						expert.contactEndTime,
						expert.externalLink1,
						expert.externalLink2,
						expert.externalLink3,
						cert1.fileRename.as("certImage1"),
						cert2.fileRename.as("certImage2"),
						cert3.fileRename.as("certImage3"),
						expert.questionAnswer1,
						expert.questionAnswer2,
						expert.questionAnswer3,
						expert.providedServiceIdx,
						expert.providedServiceDesc
				))
				.from(expert)
				.leftJoin(profile).on(expert.profileImageIdx.eq(profile.expertFileIdx))
				.leftJoin(cert1).on(expert.certImage1Id.eq(cert1.expertFileIdx))
				.leftJoin(cert2).on(expert.certImage2Id.eq(cert2.expertFileIdx))
				.leftJoin(cert3).on(expert.certImage3Id.eq(cert3.expertFileIdx))
				.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
				.where(expert.expertIdx.eq(expertIdx))
				.fetchOne();
	}

	// 리뷰 평점
	public ExpertReviewScoreDto reviewScore(Integer expertIdx) {

		QReviewExpert reviewExpert = QReviewExpert.reviewExpert;
		
		return jpaQueryFactory.select(Projections.bean(ExpertReviewScoreDto.class, 
							Expressions.numberTemplate(
			                        Double.class,
			                        "ROUND({0}, 1)",
			                        reviewExpert.score.avg().coalesce(0.0)
			                ).as("score"),
							reviewExpert.count().as("reviewCount")
				))
				.from(reviewExpert)
				.where(reviewExpert.expertIdx.eq(expertIdx))
				.fetchOne();
	}

	// 리뷰 내용
	public ResponseReviewListAndHasnext reviewList(PageRequest pageRequest, Integer expertIdx) {
		
		QReviewExpert reviewExpert = QReviewExpert.reviewExpert;
		QReviewFile file1 = new QReviewFile("file1");
		QReviewFile file2 = new QReviewFile("file2");
		QReviewFile file3 = new QReviewFile("file3");
		QProfileFile profile = QProfileFile.profileFile;
		QUser user = QUser.user;
		
		List<ExpertReviewDetailDto> content =
		        jpaQueryFactory
		            .select(Projections.bean(ExpertReviewDetailDto.class,
		                reviewExpert.reviewExpertIdx.as("reviewIdx"),
		                file1.storagePath.as("imgStoragePath"),
		                file1.fileRename.as("image1"),
		                file2.fileRename.as("image2"),
		                file3.fileRename.as("image3"),
		                user.nickname,
		                profile.storagePath.as("profileImgStoragePath"),
		                profile.fileRename.as("profileImg"),
		                reviewExpert.score,
		                reviewExpert.createdate,
		                reviewExpert.content
		            ))
		            .from(reviewExpert)
		            .leftJoin(file1).on(reviewExpert.img1.eq(file1.reviewFileIdx))
		            .leftJoin(file2).on(reviewExpert.img2.eq(file2.reviewFileIdx))
		            .leftJoin(file3).on(reviewExpert.img3.eq(file3.reviewFileIdx))
		            .leftJoin(user).on(reviewExpert.writer.eq(user.username))
		            .leftJoin(profile).on(user.profileImg.eq(profile.profileFileIdx))
		            .where(reviewExpert.expertIdx.eq(expertIdx))
		            .offset(pageRequest.getOffset())
		            // ⭐ 핵심
		            .limit(pageRequest.getPageSize() + 1)
		            .fetch();
		
		boolean hasNext = content.size() > pageRequest.getPageSize();
		
		// 한개 더 가져온거 제거
		if(hasNext) {
			content.remove(pageRequest.getPageSize());
		}
		
		return new ResponseReviewListAndHasnext(content, hasNext);
		
	}

	public EstimatePaymentExpertDto expertDetail(Integer estimateIdx) {
		
		QExpert expert = QExpert.expert;
		QExpertFile file = QExpertFile.expertFile;
		QCategory category = QCategory.category;
		QReviewExpert review = QReviewExpert.reviewExpert;
		QEstimate estimate = QEstimate.estimate;
		
		return jpaQueryFactory.select(Projections.bean(EstimatePaymentExpertDto.class, 
					expert.expertIdx,
					file.fileRename.as("imgName"),
					file.storagePath.as("imgStoragePath"),
					expert.activityName,
					category.name.as("cateName"),
					Expressions.numberTemplate(
	                        Double.class,
	                        "ROUND({0}, 1)",
	                        review.score.avg().coalesce(0.0)
	                ).as("score"),
					expert.contactStartTime,
					expert.contactEndTime
				))
				.from(expert)
				.leftJoin(file).on(expert.profileImageIdx.eq(file.expertFileIdx))
				.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
				.leftJoin(review).on(expert.expertIdx.eq(review.expertIdx))
				.leftJoin(estimate).on(expert.expertIdx.eq(estimate.expert.expertIdx))
				.where(estimate.estimateIdx.eq(estimateIdx))
				.fetchOne();
	}
	
	
	
}
