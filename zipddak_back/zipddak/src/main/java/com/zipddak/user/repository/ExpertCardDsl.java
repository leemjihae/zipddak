package com.zipddak.user.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.ExpertCardDto;
import com.zipddak.entity.QCareer;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QReviewExpert;
import com.zipddak.user.dto.ExpertCardsDto;

@Repository
public class ExpertCardDsl {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public ExpertCardsDto expertsMain(Integer categoryNo, String keyword) {

		QCategory category = QCategory.category;
		QExpert expert = QExpert.expert;
		QExpertFile file = QExpertFile.expertFile;
		QMatching matching = QMatching.matching;
		QReviewExpert review = QReviewExpert.reviewExpert;
		QCareer career = QCareer.career;

		// career months 합계를 expert 기준으로 가져오는 Expression
		NumberExpression<Integer> careerSumExpr = Expressions.numberTemplate(Integer.class,
				"(select coalesce(sum(c2.months), 0) from Career c2 where c2.expertIdx = {0})", expert.expertIdx);

		BooleanBuilder builder = new BooleanBuilder();

		// 카테고리 필터
		switch (categoryNo) {
		case 0:
			break;
		case 23:
			builder.and(expert.mainServiceIdx.gt(22).and(expert.mainServiceIdx.lt(44)));
			break;
		case 44:
			builder.and(expert.mainServiceIdx.gt(43).and(expert.mainServiceIdx.lt(74)));
			break;
		case 74:
			builder.and(expert.mainServiceIdx.eq(74));
			break;
		}
		
		

		// 멤버십 종료일도 넣기
//		builder.and(builder)

		JPQLQuery<ExpertCardDto> query = jpaQueryFactory
				.select(Projections.bean(ExpertCardDto.class, 
						expert.expertIdx, 
						expert.addr1, 
						expert.addr2,
						file.fileRename.as("imgFileRename"), 
						file.storagePath.as("imgStoragePath"), 
						expert.activityName, 
						expert.mainServiceIdx,
						category.name.as("mainServiceName"),
						Expressions.numberTemplate(Double.class, "COALESCE(ROUND({0}, 1), 0)", // null이면 0으로 대체
								review.score.avg()).as("avgRating"),
						review.reviewExpertIdx.countDistinct().as("reviewCount"), 
						expert.introduction,
						matching.matchingIdx.countDistinct().as("matchingCount"), 
						careerSumExpr.as("career")))
				
				
				.from(expert).leftJoin(file).on(expert.profileImageIdx.eq(file.expertFileIdx))
				.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
				.leftJoin(matching).on(expert.expertIdx.eq(matching.expertIdx))
				.leftJoin(review).on(expert.expertIdx.eq(review.expertIdx))
				.leftJoin(career).on(expert.expertIdx.eq(career.expertIdx));
		
		//키워드
				if (keyword != null && !keyword.isEmpty()) {
					BooleanBuilder keywordBuilder = new BooleanBuilder();
					keywordBuilder.or(expert.activityName.contains(keyword));
					keywordBuilder.or(category.name.contains(keyword));
					keywordBuilder.or(expert.introduction.contains(keyword));

					builder.and(keywordBuilder); // 모든 OR 조건을 AND로 묶음
				}
		
				builder.and(expert.activityStatus.eq("ACTIVE"));

		List<ExpertCardDto> cards = query.where(builder)
				.groupBy(expert.expertIdx, expert.addr1, expert.addr2, file.fileRename, file.storagePath,
						expert.activityName, expert.mainServiceIdx, category.name, expert.introduction)
				.orderBy(Expressions.numberTemplate(Double.class, "RAND()").asc())
				.limit(4).offset(0).fetch();

		Long totalCount = jpaQueryFactory
				.select(expert.expertIdx.countDistinct()).from(expert)
				.leftJoin(category).on(expert.mainServiceIdx.eq(category.categoryIdx))
				.where(builder)
				.fetchOne();

		return new ExpertCardsDto(cards, totalCount);

	}

}
