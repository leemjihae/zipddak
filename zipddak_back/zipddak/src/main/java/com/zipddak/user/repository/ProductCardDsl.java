package com.zipddak.user.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QFavoritesProduct;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.entity.QSeller;
import com.zipddak.user.dto.ProductCardsDto;

@Repository
public class ProductCardDsl {
	
	@Autowired
	private JPAQueryFactory jpaQueryFactory;
	
	// ProductCardDto 타입으로 반환
		// 자재 상품 목록 조회
		public ProductCardsDto productsMain(Integer categoryNo,String keyword,String username) throws Exception {

			// 자재 상품
			QProduct product = QProduct.product;
			// 리뷰 평점, 리뷰 수
			QReviewProduct review = QReviewProduct.reviewProduct;
			// 로그인 한 사용자가 관심 상품으로 등록했는지 여부
			QFavoritesProduct favorite = QFavoritesProduct.favoritesProduct;
			// 썸네일 이미지
			QProductFile productFile = QProductFile.productFile;
			// 상품 판매 업체
			QSeller seller = QSeller.seller;
			// 상품 카테고리
			QCategory category = QCategory.category;
			

			// 로그인 했을때 안했을때 구분
			Expression<Boolean> isFavoriteExpr = Expressions.asBoolean(false).as("favorite");
			
			if (username != null && !username.isBlank()) {
				isFavoriteExpr = new CaseBuilder().when(favorite.productIdx.isNotNull()).then(true).otherwise(false)
						.as("favorite");
			}

			BooleanBuilder where = new BooleanBuilder();

//			// 상품 공개 유무가 1인 상품만
			where.and(product.visibleYn.eq(true));

			// 카테고리
			if(categoryNo != null && categoryNo != 0) {
			where.and(product.categoryIdx.eq(categoryNo));
			}
			
			//키워드
			if (keyword != null && !keyword.isBlank()) {
				where.and(product.name.contains(keyword));
			}
			
			//승인된 seller
//			where.and(seller.activityStatus.eq("ACTIVE"));

			// 평점 높은순
			OrderSpecifier<?> order;
			order = review.score.avg().coalesce(0.0).desc();

			JPQLQuery<ProductCardDto> query = jpaQueryFactory
			        .select(Projections.bean(ProductCardDto.class,
			                product.productIdx,
			                product.name,
			                product.discount,
			                product.salePrice,
			                product.price,
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
			        .leftJoin(seller).on(seller.user.username.eq(product.sellerUsername));
//			        .leftJoin(category).on(category.categoryIdx.eq(product.subCategoryIdx));
			
			if(username != null && !username.isBlank()) {
				query.leftJoin(favorite)
						.on(favorite.productIdx.eq(product.productIdx).and(favorite.userUsername.eq(username)));
			}
		 
		 List<ProductCardDto> cards = query
		            .where(where)
		            .groupBy(product.productIdx)
		            .orderBy(order)
		            .limit(6)
		            .offset(0)
		            .fetch();
		 
		 Long totalCount = jpaQueryFactory
		            .select(product.productIdx.countDistinct())
		            .from(product)
		            .where(where)
		            .fetchOne();
		 
		 return new ProductCardsDto(cards, totalCount);

		}
		
		
		public List<ProductCardDto> Bestproducts(String username) throws Exception {

			// 자재 상품
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


			// 로그인 했을때 안했을때 구분
			Expression<Boolean> isFavoriteExpr = Expressions.asBoolean(false).as("favorite");

			if (username != null && !username.isBlank()) {
				isFavoriteExpr = new CaseBuilder().when(favorite.productIdx.isNotNull()).then(true).otherwise(false)
						.as("favorite");
			}

			BooleanBuilder where = new BooleanBuilder();

			// 상품 공개 유무가 1인 상품만
			where.and(product.visibleYn.eq(true));

			//판매량 높은순
			OrderSpecifier<?> order;
			order = orderItem.quantity.sum().coalesce(0).desc();
				

			JPQLQuery<ProductCardDto> query = jpaQueryFactory
			        .select(Projections.bean(ProductCardDto.class,
			                product.productIdx,
			                product.name,
			                product.discount,
			                product.salePrice,
			                product.price,
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
//			        .leftJoin(category).on(category.categoryIdx.eq(product.subCategoryIdx))
			        .leftJoin(orderItem).on(orderItem.product.productIdx.eq(product.productIdx));
			
			if(username != null && !username.isBlank()) {
				query.leftJoin(favorite)
						.on(favorite.productIdx.eq(product.productIdx).and(favorite.userUsername.eq(username)));
			}

			return query.where(where)
//					.groupBy(product.productIdx, product.name, product.discount, product.salePrice, product.sellerUsername,
//							productFile.fileRename, productFile.storagePath)
					.groupBy(product.productIdx)
					// 판매 이력이 없는 상품은 null이 될 수 있음 -> null일경우 판매 횟수 0으로 처리
					.orderBy(order).limit(100).fetch();

		}

	
	

}
