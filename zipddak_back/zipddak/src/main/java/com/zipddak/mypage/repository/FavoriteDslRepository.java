package com.zipddak.mypage.repository;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.Career;
import com.zipddak.entity.QCareer;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QCommunity;
import com.zipddak.entity.QCommunityFile;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QFavoritesCommunity;
import com.zipddak.entity.QFavoritesExpert;
import com.zipddak.entity.QFavoritesProduct;
import com.zipddak.entity.QFavoritesTool;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QReply;
import com.zipddak.entity.QReviewExpert;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QTool;
import com.zipddak.entity.QToolFile;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.FavoriteCommunityDto;
import com.zipddak.mypage.dto.FavoriteExpertDto;
import com.zipddak.mypage.dto.FavoriteProductDto;
import com.zipddak.mypage.dto.FavoriteToolDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FavoriteDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 관심 상품목록 조회
	public List<FavoriteProductDto> selectFavoriteProductList(String username, PageRequest pageRequest)
			throws Exception {

		QFavoritesProduct favoritesProduct = QFavoritesProduct.favoritesProduct;
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		QReviewProduct reviewProduct = QReviewProduct.reviewProduct;
		QProductFile productFile = QProductFile.productFile;

		return jpaQueryFactory
				.select(Projections.constructor(FavoriteProductDto.class, product.productIdx, product.name,
						productFile.fileRename, product.salePrice, product.discount, seller.brandName,
						reviewProduct.score.avg().coalesce(0.0).intValue(), reviewProduct.count()))
				.from(favoritesProduct).leftJoin(product).on(product.productIdx.eq(favoritesProduct.productIdx))
				.leftJoin(seller).on(product.sellerUsername.eq(seller.user.username)).leftJoin(reviewProduct)
				.on(product.productIdx.eq(reviewProduct.productIdx)).leftJoin(productFile)
				.on(product.thumbnailFileIdx.eq(productFile.productFileIdx))
				.where(favoritesProduct.userUsername.eq(username)).offset(pageRequest.getOffset())
				.groupBy(product.productIdx, product.name, productFile.storagePath, product.salePrice, product.discount,
						seller.brandName)
				.limit(pageRequest.getPageSize()).fetch();
	}

	// 관심 상품목록 개수
	public Long selectFavoriteProductCount(String username) throws Exception {
		QFavoritesProduct favoritesProduct = QFavoritesProduct.favoritesProduct;

		return jpaQueryFactory.select(favoritesProduct.count()).from(favoritesProduct)
				.where(favoritesProduct.userUsername.eq(username)).fetchOne();
	}

	// 관심 공구목록 조회
	public List<FavoriteToolDto> selectFavoriteToolList(String username, PageRequest pageRequest) throws Exception {

		QTool tool = QTool.tool;
		QToolFile toolFile = QToolFile.toolFile;
		QFavoritesTool favoritesTool = QFavoritesTool.favoritesTool;

		return jpaQueryFactory
				.select(Projections.constructor(FavoriteToolDto.class, tool.toolIdx, tool.name, toolFile.fileRename,
						tool.rentalPrice, tool.tradeAddr1))
				.from(favoritesTool).leftJoin(tool).on(tool.toolIdx.eq(favoritesTool.toolIdx)).leftJoin(toolFile)
				.on(toolFile.toolFileIdx.eq(tool.thunbnail)).where(favoritesTool.userUsername.eq(username))
				.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();
	}

	// 관심 공구목록 개수
	public Long selectFavoriteToolCount(String username) throws Exception {
		QFavoritesTool favoritesTool = QFavoritesTool.favoritesTool;

		return jpaQueryFactory.select(favoritesTool.count()).from(favoritesTool)
				.where(favoritesTool.userUsername.eq(username)).fetchOne();
	}

	// 관심 전문가목록 조회
	public List<FavoriteExpertDto> selectFavoriteExpertList(String username, PageRequest pageRequest) throws Exception {

		QFavoritesExpert favoritesExpert = QFavoritesExpert.favoritesExpert;
		QExpert expert = QExpert.expert;
		QExpertFile expertFile = QExpertFile.expertFile;
		QCategory category = QCategory.category;
		QReviewExpert reviewExpert = QReviewExpert.reviewExpert;
		QMatching matching = QMatching.matching;
		QCareer career = QCareer.career;

		List<FavoriteExpertDto> result = jpaQueryFactory
				.select(Projections.constructor(FavoriteExpertDto.class, expert.expertIdx, expert.activityName,
						expertFile.fileRename, category.name, expert.addr1, Expressions.constant(0), matching.count(),
						reviewExpert.score.avg().coalesce(0.0).intValue(), reviewExpert.count()))
				.from(favoritesExpert).leftJoin(expert).on(expert.expertIdx.eq(favoritesExpert.expertIdx))
				.leftJoin(expertFile).on(expertFile.expertFileIdx.eq(expert.profileImageIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(expert.mainServiceIdx)).leftJoin(reviewExpert)
				.on(reviewExpert.expertIdx.eq(expert.expertIdx)).leftJoin(matching)
				.on(matching.expertIdx.eq(expert.expertIdx)).leftJoin(career).on(career.expertIdx.eq(expert.expertIdx))
				.where(favoritesExpert.userUsername.eq(username))
				.groupBy(expert.expertIdx, expert.activityName, expertFile.fileRename, category.name)
				.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();

		// 2) 전문가별 career 조회 + Java로 경력 계산
		for (FavoriteExpertDto dto : result) {
			List<Career> careers = jpaQueryFactory.selectFrom(career).where(career.expertIdx.eq(dto.getExpertIdx()))
					.fetch();

			dto.setCareerCount(calculateCareerMonths(careers));
		}

		return result;
	}

	private int calculateCareerMonths(List<Career> careers) {
		int totalMonths = 0;

		for (Career c : careers) {
			if (c.getStartDate() != null && c.getEndDate() != null) {
				LocalDate start = c.getStartDate().toLocalDate();
				LocalDate end = c.getEndDate().toLocalDate();

				Period p = Period.between(start, end);
				totalMonths += p.getYears() * 12 + p.getMonths();
			}
		}

		return totalMonths;
	}

	// 관심 전문가목록 개수
	public Long selectFavoriteExpertCount(String username) throws Exception {
		QFavoritesExpert favoritesExpert = QFavoritesExpert.favoritesExpert;

		return jpaQueryFactory.select(favoritesExpert.count()).from(favoritesExpert)
				.where(favoritesExpert.userUsername.eq(username)).fetchOne();
	}

	// 관심 커뮤니티목록 조회
	public List<FavoriteCommunityDto> selectFavoriteCommunityList(String username, PageRequest pageRequest)
			throws Exception {

		QFavoritesCommunity favoritesCommunity = QFavoritesCommunity.favoritesCommunity;
		QCommunity community = QCommunity.community;
		QCategory category = QCategory.category;
		QUser user = QUser.user;
		QCommunityFile communityFile = QCommunityFile.communityFile;
		QReply reply = QReply.reply;

		return jpaQueryFactory
				.select(Projections.constructor(FavoriteCommunityDto.class, community.communityIdx, category.name,
						community.title, community.content, communityFile.fileRename, user.nickname, community.views,
						reply.count()))

				.from(favoritesCommunity)

				.leftJoin(community).on(community.communityIdx.eq(favoritesCommunity.communityIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(community.category)).leftJoin(user)
				.on(user.username.eq(community.user.username)).leftJoin(communityFile)
				.on(communityFile.communityFileIdx.eq(community.img1)).leftJoin(reply)
				.on(reply.communityIdx.eq(community.communityIdx)).where(favoritesCommunity.userUsername.eq(username))
				.groupBy(community.communityIdx, category.name, community.title, community.content,
						communityFile.fileRename, user.nickname, community.views)
				.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();
	}

	// 관심 커뮤니티목록 개수
	public Long selectFavoriteCommunityCount(String username) throws Exception {
		QFavoritesCommunity favoritesCommunity = QFavoritesCommunity.favoritesCommunity;

		return jpaQueryFactory.select(favoritesCommunity.count()).from(favoritesCommunity)
				.where(favoritesCommunity.userUsername.eq(username)).fetchOne();
	}

	// 내 커뮤니티목록 조회
	public List<FavoriteCommunityDto> selectMyCommunityList(String username, PageRequest pageRequest) throws Exception {

		QCommunity community = QCommunity.community;
		QCategory category = QCategory.category;
		QUser user = QUser.user;
		QCommunityFile communityFile = QCommunityFile.communityFile;
		QReply reply = QReply.reply;

		return jpaQueryFactory
				.select(Projections.constructor(FavoriteCommunityDto.class, community.communityIdx, category.name,
						community.title, community.content, communityFile.fileRename, user.nickname, community.views,
						reply.count()))
				.from(community).leftJoin(category).on(category.categoryIdx.eq(community.category)).leftJoin(user)
				.on(user.username.eq(community.user.username)).leftJoin(communityFile)
				.on(communityFile.communityFileIdx.eq(community.img1)).leftJoin(reply)
				.on(reply.communityIdx.eq(community.communityIdx)).where(community.user.username.eq(username))
				.groupBy(community.communityIdx, category.name, community.title, community.content,
						communityFile.storagePath, user.nickname, community.views)
				.offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();
	}

	// 내 커뮤니티목록 개수
	public Long selectMyCommunityCount(String username) throws Exception {
		QCommunity community = QCommunity.community;

		return jpaQueryFactory.select(community.count()).from(community).where(community.user.username.eq(username))
				.fetchOne();
	}

}
