package com.zipddak.admin.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.CommunityDetailDto;
import com.zipddak.admin.dto.CommunityListDto;
import com.zipddak.admin.dto.CommunityModifyDetailDto;
import com.zipddak.admin.dto.CommunityPagetDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QCommunity;
import com.zipddak.entity.QCommunityFile;
import com.zipddak.entity.QFavoritesCommunity;
import com.zipddak.entity.QProfileFile;
import com.zipddak.entity.QReply;
import com.zipddak.entity.QUser;
import com.zipddak.util.PageInfo;

@Repository
public class CommunityDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;
	
	public CommunityDetailDto communityDetail(int communityId) {

		QCommunity community = QCommunity.community;
		QCategory category = QCategory.category;
		QCommunityFile file1 = new QCommunityFile("file1");
		QCommunityFile file2 = new QCommunityFile("file2");
		QCommunityFile file3 = new QCommunityFile("file3");
		QCommunityFile file4 = new QCommunityFile("file4");
		QCommunityFile file5 = new QCommunityFile("file5");
		
		QUser user = QUser.user;
		QProfileFile profile = QProfileFile.profileFile;
		
		return jpaQueryFactory.select(Projections.bean(CommunityDetailDto.class, 
				community.communityIdx.as("communityId"),
				category.name.as("cateName"),
				community.title,
				community.createdate.as("createdAt"),
				community.views.as("viewCount"),
				community.content,
				file1.storagePath.as("communityStoragePath"),
				file1.fileRename.as("img1"),
				file2.fileRename.as("img2"),
				file3.fileRename.as("img3"),
				file4.fileRename.as("img4"),
				file5.fileRename.as("img5"),
				user.nickname,
				profile.fileRename.as("imgFile"),
				profile.storagePath.as("imgStoragePath")
				))
				.from(community)
				.leftJoin(category).on(category.categoryIdx.eq(community.category))
				.leftJoin(file1).on(file1.communityFileIdx.eq(community.img1))
				.leftJoin(file2).on(file2.communityFileIdx.eq(community.img2))
				.leftJoin(file3).on(file3.communityFileIdx.eq(community.img3))
				.leftJoin(file4).on(file4.communityFileIdx.eq(community.img4))
				.leftJoin(file5).on(file5.communityFileIdx.eq(community.img5))
				.leftJoin(user).on(user.username.eq(community.user.username))
				.leftJoin(profile).on(user.profileImg.eq(profile.profileFileIdx))
				.where(community.communityIdx.eq(communityId))
				.fetchOne();
				
	}

	public CommunityModifyDetailDto modifyCommunityDetail(Integer modifyCommunityId) {
		
		QCommunity community = QCommunity.community;
		QCommunityFile file1 = new QCommunityFile("file1");
		QCommunityFile file2 = new QCommunityFile("file2");
		QCommunityFile file3 = new QCommunityFile("file3");
		QCommunityFile file4 = new QCommunityFile("file4");
		QCommunityFile file5 = new QCommunityFile("file5");
		QCategory category = QCategory.category;
		
		return jpaQueryFactory.select(Projections.bean(CommunityModifyDetailDto.class, 
						community.communityIdx.as("communityId"),
						community.title,
						community.content,
						file1.fileRename.as("img1"),
						file1.communityFileIdx.as("img1id"),
						file2.fileRename.as("img2"),
						file2.communityFileIdx.as("img2id"),
						file3.fileRename.as("img3"),
						file3.communityFileIdx.as("img3id"),
						file4.fileRename.as("img4"),
						file4.communityFileIdx.as("img4id"),
						file5.fileRename.as("img5"),
						file5.communityFileIdx.as("img5id"),
						file1.storagePath.as("imgStoragePath"),
						category.categoryIdx.as("category")
				))
				.from(community)
				.leftJoin(file1).on(community.img1.eq(file1.communityFileIdx))
				.leftJoin(file2).on(community.img2.eq(file2.communityFileIdx))
				.leftJoin(file3).on(community.img3.eq(file3.communityFileIdx))
				.leftJoin(file4).on(community.img4.eq(file4.communityFileIdx))
				.leftJoin(file5).on(community.img5.eq(file5.communityFileIdx))
				.leftJoin(category).on(community.category.eq(category.categoryIdx))
				.where(community.communityIdx.eq(modifyCommunityId))
				.fetchOne();

	}

	public CommunityPagetDto communityList(Integer category, Integer page) {
		
		int curPage = page;
		int itemsPerPage = 5; 
		int buttonsPerPage = 5;
		
		QCommunity community = QCommunity.community;
		QCategory qCategory = QCategory.category;
		QUser user = QUser.user;
		QCommunityFile file = QCommunityFile.communityFile;
		QReply reply = QReply.reply;
		QFavoritesCommunity favorite = QFavoritesCommunity.favoritesCommunity;
		
		JPAQuery<Long> countQuery = jpaQueryFactory.select(community.count())
					.from(community);
		
		countQuery.where(community.category.eq(category));
		
		long totalItems = countQuery.fetchOne();
		
	    // 2. 페이징 계산
	    int allPage = (int) Math.ceil((double) totalItems / itemsPerPage);

	    int startPage = ((curPage - 1) / buttonsPerPage) * buttonsPerPage + 1;
	    int endPage = Math.min(startPage + buttonsPerPage - 1, allPage);
	    
	    // 3. 실제 데이터 조회
	    List<CommunityListDto> communityList = jpaQueryFactory.select(Projections.bean(CommunityListDto.class, 
	    											community.communityIdx.as("communityId"),
	    											qCategory.name.as("categoryName"),
	    											community.title,
	    											community.content,
	    											user.nickname,
	    											community.views.as("viewCount"),
	    											reply.replyIdx.countDistinct().as("replyCount"),
	    											favorite.favoriteIdx.countDistinct().as("favoriteCount"),
	    											file.fileRename.as("img1"),
	    											file.storagePath.as("imgStroagePath")
	    									))
	    									.from(community)
	    									.leftJoin(qCategory).on(community.category.eq(qCategory.categoryIdx))
	    									.leftJoin(reply).on(community.communityIdx.eq(reply.communityIdx))
	    									.leftJoin(favorite).on(community.communityIdx.eq(favorite.communityIdx))
	    									.leftJoin(user).on(community.user.username.eq(user.username))
	    									.leftJoin(file).on(community.img1.eq(file.communityFileIdx))
	    									.where(qCategory.categoryIdx.eq(category))
	    									.groupBy(community.communityIdx, qCategory.name, user.nickname, file.fileRename, file.storagePath)
	    									.offset((curPage - 1) * itemsPerPage)
	    									.limit(itemsPerPage)
	    									.fetch();
											

	    System.out.println(communityList);
	    
	    // 4. PageInfo 세팅
	    PageInfo pageInfo = new PageInfo();
	    pageInfo.setCurPage(curPage);
	    pageInfo.setAllPage(allPage);
	    pageInfo.setStartPage(startPage);
	    pageInfo.setEndPage(endPage);

	    // 5. DTO 반환
	    CommunityPagetDto result = new CommunityPagetDto();
	    result.setCommunityList(communityList);
	    result.setPageInfo(pageInfo);
		
		return result;
	}

}
