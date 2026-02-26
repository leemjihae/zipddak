package com.zipddak.seller.repository;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.dto.SellerDto;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QSellerFile;
import com.zipddak.entity.QUser;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerMypageRepository {
	
	private final JPAQueryFactory jpaQueryFactory;
	
	//프로필 상세보기
	public SellerDto findBySellerIdxAndSellerId(String sellerUsername) {
		QSeller seller = QSeller.seller;
		QSellerFile logo = QSellerFile.sellerFile;
		QUser user = QUser.user;
		
		
		return jpaQueryFactory.select(Projections.fields(SellerDto.class,
										seller.sellerIdx,
										seller.logoFileIdx,
										seller.brandName,
										seller.handleItemCateIdx,
										seller.introduction,
										seller.compHp,
										seller.pickupZonecode,
										seller.pickupAddr1,
										seller.pickupAddr2,
										seller.basicPostCharge,
										seller.freeChargeAmount,
										seller.createdAt,
										seller.activityStatus,
										logo.fileRename.as("logoFileRename")
						        ))
						        .from(seller)
						        .join(user).on(user.username.eq(seller.user.username))
						        .leftJoin(logo).on(logo.sellerFileIdx.eq(seller.logoFileIdx))
						        .where(seller.user.username.eq(sellerUsername))
						        .fetchOne();
	}
	

}
