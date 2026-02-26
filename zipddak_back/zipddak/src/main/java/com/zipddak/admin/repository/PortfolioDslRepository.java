package com.zipddak.admin.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.ExpertPortfolioDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QPortfolio;

@Repository
public class PortfolioDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public List<ExpertPortfolioDto> expertPortfolio(Integer expertIdx) {

		QPortfolio portfolio = QPortfolio.portfolio;
		QExpertFile expertFile1 = new QExpertFile("expertFile1");
		QExpertFile expertFile2 = new QExpertFile("expertFile2");
		QExpertFile expertFile3 = new QExpertFile("expertFile3");
		QCategory category = QCategory.category;
		
		return jpaQueryFactory.select(Projections.bean(ExpertPortfolioDto.class, 
					portfolio.portfolioIdx,
					portfolio.title,
					portfolio.serviceIdx,
					category.name.as("serviceName"),
					portfolio.region,
					portfolio.price,
					portfolio.workTimeType,
					portfolio.workTimeValue,
					expertFile1.fileRename.as("image1"),
					expertFile2.fileRename.as("image2"),
					expertFile3.fileRename.as("image3"),
					portfolio.description,
					expertFile1.storagePath.as("imagePath")
				))
				.from(portfolio)
				.leftJoin(expertFile1).on(portfolio.image1Idx.eq(expertFile1.expertFileIdx))
				.leftJoin(expertFile2).on(portfolio.image2Idx.eq(expertFile2.expertFileIdx))
				.leftJoin(expertFile3).on(portfolio.image3Idx.eq(expertFile3.expertFileIdx))
				.leftJoin(category).on(portfolio.serviceIdx.eq(category.categoryIdx))
				.where(portfolio.expertIdx.eq(expertIdx))
				.orderBy(portfolio.createdAt.desc())
				.fetch();
	}
	
}
