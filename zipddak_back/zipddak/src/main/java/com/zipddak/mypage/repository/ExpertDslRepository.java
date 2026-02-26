package com.zipddak.mypage.repository;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.dto.CareerDto;
import com.zipddak.entity.QCareer;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QPortfolio;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.ExpertProfileDto;
import com.zipddak.mypage.dto.PortfolioListDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ExpertDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	QExpert expert = QExpert.expert;

	// 전문가 프로필 기본 정보 조회
	public ExpertProfileDto selectExpertProfileBase(String username) throws Exception{

		QExpertFile expertFile1 = new QExpertFile("expertFile1");
	    QExpertFile expertFile2 = new QExpertFile("expertFile2");
	    QExpertFile expertFile3 = new QExpertFile("expertFile3");
	    QExpertFile expertFile4 = new QExpertFile("expertFile4");
	    QExpertFile expertFile5 = new QExpertFile("expertFile5");
	    QCategory category = QCategory.category;
	    QUser user = QUser.user;

	    return jpaQueryFactory.select(
	            Projections.fields(
	                    ExpertProfileDto.class,
	                    expert.expertIdx.as("expertIdx"),
	                    user.username.as("username"),
	                    expert.activityName.as("activityName"),
	                    expertFile1.fileRename.as("profileImage"),
	                    expert.introduction.as("introduction"),
	                    expert.mainServiceIdx.as("mainServiceIdx"),
	                    category.name.as("mainService"),
	                    expert.zonecode,
	                    expert.addr1,
	                    expert.addr2,
	                    expert.employeeCount,
	                    expert.contactStartTime,
	                    expert.contactEndTime,
	                    expert.externalLink1,
	                    expert.externalLink2,
	                    expert.externalLink3,
	                    expert.providedServiceIdx,
	                    expert.providedServiceDesc,
	                    expertFile2.fileRename.as("certImage1"),
	                    expertFile3.fileRename.as("certImage2"),
	                    expertFile4.fileRename.as("certImage3"),
	                    expert.certImage1Id.as("certImageIdx1"),
	                    expert.certImage2Id.as("certImageIdx2"),
	                    expert.certImage3Id.as("certImageIdx3"),
	                    expertFile5.fileRename.as("businessLicensePdf"),
	                    expert.questionAnswer1,
	                    expert.questionAnswer2,
	                    expert.questionAnswer3
	            ))
				.from(expert)
				.leftJoin(expert.user, user)
				.leftJoin(category).on(category.categoryIdx.eq(expert.mainServiceIdx))
				.leftJoin(expertFile1).on(expertFile1.expertFileIdx.eq(expert.profileImageIdx))
				.leftJoin(expertFile2).on(expertFile2.expertFileIdx.eq(expert.certImage1Id))
				.leftJoin(expertFile3).on(expertFile3.expertFileIdx.eq(expert.certImage2Id))
				.leftJoin(expertFile4).on(expertFile4.expertFileIdx.eq(expert.certImage3Id))
				.leftJoin(expertFile5).on(expertFile5.expertFileIdx.eq(expert.businessLicensePdfId))
				.where(user.username.eq(username))
				.fetchOne();
	}

	// 제공 서비스 목록 조회
	public List<String> selectProvidedServiceByIdxList(List<Integer> idxList) {

	    QCategory category = QCategory.category;

	    if (idxList == null || idxList.isEmpty()) {
	        return Collections.emptyList();
	    }

	    return jpaQueryFactory
	            .select(category.name)
	            .from(category)
	            .where(category.categoryIdx.in(idxList))
	            .fetch();
	}

	// 경력 목록 조회
	public List<CareerDto> selectCareerList(Integer expertIdx) {

	    QCareer career = QCareer.career;

	    return jpaQueryFactory.select(Projections.constructor(
	                    CareerDto.class,
	                    career.careerIdx,
	                    career.expertIdx,
	                    career.title,
	                    career.startDate,
	                    career.endDate,
	                    career.description,
	                    career.createdAt,
	                    career.months
	            ))
	            .from(career)
	            .where(career.expertIdx.eq(expertIdx))
	            .fetch();
	}

	// 포트폴리오 목록 조회
	public List<PortfolioListDto> selectPortfolioList(Integer expertIdx) {

	    QPortfolio portfolio = QPortfolio.portfolio;
	    QExpertFile expertFile = QExpertFile.expertFile;

	    return jpaQueryFactory
	            .select(Projections.constructor(
	                   PortfolioListDto.class,
	                    portfolio.portfolioIdx,
	                    expertFile.fileRename
	            ))
	            .from(portfolio)
	            .leftJoin(expertFile).on(expertFile.expertFileIdx.eq(portfolio.image1Idx))
	            .where(portfolio.expertIdx.eq(expertIdx))
	            .fetch();
	}

}
