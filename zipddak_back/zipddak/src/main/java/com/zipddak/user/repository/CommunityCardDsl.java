package com.zipddak.user.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.CommunityListDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QCommunity;
import com.zipddak.entity.QCommunityFile;
import com.zipddak.entity.QFavoritesCommunity;
import com.zipddak.entity.QReply;
import com.zipddak.entity.QUser;
import com.zipddak.user.dto.CommunityCardsDto;

@Repository
public class CommunityCardDsl {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public CommunityCardsDto communityMain(Integer category, String keyword) {

		QCommunity community = QCommunity.community;
		QCategory qCategory = QCategory.category;
		QUser user = QUser.user;
		QCommunityFile file = QCommunityFile.communityFile;
		QReply reply = QReply.reply;
		QFavoritesCommunity favorite = QFavoritesCommunity.favoritesCommunity;

		BooleanBuilder where = new BooleanBuilder();

		// 카테고리
        if (category != null && category != 0) {
            where.and(community.category.eq(category));
        }

		// 키워드
		if (keyword != null && !keyword.isBlank()) {
			where.and(community.title.contains(keyword));
		}
		
		// 조회순정렬
		OrderSpecifier<?> order;
		order = community.views.count().desc();

		
		List<CommunityListDto> communityList = jpaQueryFactory
				.select(Projections.bean(CommunityListDto.class, 
						community.communityIdx.as("communityId"),
						qCategory.name.as("categoryName"), 
						community.title, community.content, 
						user.nickname,
						community.views.as("viewCount"), 
						reply.replyIdx.countDistinct().as("replyCount"),
						favorite.favoriteIdx.countDistinct().as("favoriteCount"), 
						file.fileRename.as("img1"),
						file.storagePath.as("imgStroagePath")))
				
				.from(community)
				.leftJoin(qCategory).on(community.category.eq(qCategory.categoryIdx))
				.leftJoin(reply).on(community.communityIdx.eq(reply.communityIdx))
				.leftJoin(favorite).on(community.communityIdx.eq(favorite.communityIdx))
				.leftJoin(user).on(community.user.username.eq(user.username))
				.leftJoin(file).on(community.img1.eq(file.communityFileIdx))
				.where(where)
				.groupBy(community.communityIdx)
				.offset(0).limit(4).orderBy(order).fetch();
		
		Long totalCount = jpaQueryFactory
				.select(community.communityIdx.countDistinct())
				.from(community)
				.where(where)
				.fetchOne();
		

		return new CommunityCardsDto(communityList, totalCount);
	}

}
