package com.zipddak.admin.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.SellerInfoDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QFavoritesProduct;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QSellerFile;

@Repository
public class SellerInfoDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public SellerInfoDto getSellerInfo(Integer sellerId) {

		QSeller seller = QSeller.seller;
		QSellerFile sellerFile = QSellerFile.sellerFile;
		
		return jpaQueryFactory.select(Projections.bean(SellerInfoDto.class, 
					seller.sellerIdx,
					seller.user.username,
					sellerFile.fileRename.as("logoFileRename"),
					sellerFile.storagePath.as("logoFileStorage"),
					seller.compHp,
					seller.brandName,
					seller.handleItemCateIdx,
					seller.introduction,
					seller.compAddr1,
					seller.compAddr2,
					seller.managerTel
				))
				.from(seller)
				.leftJoin(sellerFile).on(seller.logoFileIdx.eq(sellerFile.sellerFileIdx))
				.where(seller.sellerIdx.eq(sellerId))
				.fetchOne();
	}

	// 16개씩 상품 프로필 카드 가져오기
	public List<ProductCardDto> productList(int categoryNo, PageRequest pageRequest, Integer sellerId, String username) {
		
		QProduct product = QProduct.product;
		// 리뷰 평점, 리뷰 수
		QReviewProduct review = QReviewProduct.reviewProduct;
		// 로그인 한 사용자가 관심 상품으로 등록했는지 여부
		QFavoritesProduct favorite = QFavoritesProduct.favoritesProduct;
		// 인기순 정렬에서 사용
		QOrderItem orderItem = QOrderItem.orderItem;
		// 썸네일 이미지
		QProductFile productFile = QProductFile.productFile;
		// 상품 판매 업체
		QSeller seller = QSeller.seller;
		// 상품 카테고리
		QCategory category = QCategory.category;
		
		Expression<Boolean> isFavoriteExpr = Expressions.asBoolean(false);

		if (username != null && !username.isBlank()) {
			isFavoriteExpr = new CaseBuilder().when(favorite.productIdx.isNotNull()).then(true).otherwise(false)
					.as("favorite");
		}

		BooleanBuilder where = new BooleanBuilder();

		// 상품 공개 유무가 1인 상품만
		where.and(product.visibleYn.eq(true));

		if(categoryNo != 0) {
			where.and(product.categoryIdx.eq(categoryNo));
		}

		JPQLQuery<ProductCardDto> query = jpaQueryFactory
		        .select(Projections.bean(ProductCardDto.class,
		                product.productIdx,
		                product.name,
		                product.discount,
		                product.salePrice,
		                product.sellerUsername,
		                productFile.fileRename,
		                productFile.storagePath,
		                Expressions.numberTemplate(
		                        Double.class,
		                        "ROUND({0}, 1)",
		                        review.score.avg().coalesce(0.0)
		                ).as("avgRating"),
		                // count는 항상 Long 타입으로 반환
		                review.count().as("reviewCount"),
		                seller.brandName,
		                isFavoriteExpr
		                
		        ))
		        .from(product)
		        .leftJoin(review).on(review.productIdx.eq(product.productIdx))
		        .leftJoin(productFile).on(productFile.productFileIdx.eq(product.thumbnailFileIdx))
		        .leftJoin(seller).on(seller.user.username.eq(product.sellerUsername))
		        .leftJoin(category).on(category.categoryIdx.eq(product.subCategoryIdx))
		        .leftJoin(orderItem).on(orderItem.product.productIdx.eq(product.productIdx));
		
		if(username != null && !username.isBlank()) {
			query.leftJoin(favorite)
					.on(favorite.productIdx.eq(product.productIdx).and(favorite.userUsername.eq(username)));
		}

		return query.where(where)
				.groupBy(product.productIdx, product.name, product.discount, product.salePrice, product.sellerUsername,
						productFile.fileRename, productFile.storagePath)
				// 판매 이력이 없는 상품은 null이 될 수 있음 -> null일경우 판매 횟수 0으로 처리
				.orderBy(product.createdAt.desc()).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();

	}
	
	public List<ProductCardDto> bestProductList(PageRequest pageRequest, Integer sellerId, String username) {

	    QProduct product = QProduct.product;
	    QReviewProduct review = QReviewProduct.reviewProduct;
	    QFavoritesProduct favorite = QFavoritesProduct.favoritesProduct;
	    QOrderItem orderItem = QOrderItem.orderItem;
	    QProductFile productFile = QProductFile.productFile;
	    QSeller seller = QSeller.seller;

	    // 로그인한 유저의 관심상품 여부
	    Expression<Boolean> isFavoriteExpr = ExpressionUtils.as(Expressions.constant(false), "favorite"); 
	    if (username != null && !username.isBlank()) {
	        isFavoriteExpr = new CaseBuilder()
	                .when(favorite.productIdx.isNotNull()).then(true)
	                .otherwise(false)
	                .as("favorite");
	    }

	    BooleanBuilder where = new BooleanBuilder();
	    where.and(product.visibleYn.eq(true)); // 공개된 상품만

	    JPQLQuery<ProductCardDto> query = jpaQueryFactory
	            .select(Projections.bean(
	                    ProductCardDto.class,
	                    product.productIdx,
	                    product.name,
	                    product.discount,
	                    product.salePrice,
	                    product.sellerUsername,
	                    productFile.fileRename,
	                    productFile.storagePath,
	                    Expressions.numberTemplate(
	                            Double.class,
	                            "ROUND({0}, 1)",
	                            review.score.avg().coalesce(0.0)
	                    ).as("avgRating"),
	                    review.count().as("reviewCount"),
	                    isFavoriteExpr
	            ))
	            .from(product)
	            .leftJoin(review).on(review.productIdx.eq(product.productIdx))
	            .leftJoin(productFile).on(productFile.productFileIdx.eq(product.thumbnailFileIdx))
	            .leftJoin(seller).on(seller.user.username.eq(product.sellerUsername))
	            .leftJoin(orderItem).on(orderItem.product.productIdx.eq(product.productIdx));

	    if (username != null && !username.isBlank()) {
	        query.leftJoin(favorite)
	                .on(favorite.productIdx.eq(product.productIdx)
	                        .and(favorite.userUsername.eq(username)));
	    }

	    return query.where(where)
	            .groupBy(product.productIdx, product.name, product.discount, product.salePrice,
	                    product.sellerUsername, productFile.fileRename, productFile.storagePath)
	            .orderBy(
	                    orderItem.count().desc(),        // ⭐ 판매량 기준 인기순
	                    product.createdAt.desc()          // 판매량 같으면 최신순
	            )
	            .offset(pageRequest.getOffset())
	            .limit(pageRequest.getPageSize()) // 보통 4
	            .fetch();
	}

	
}
