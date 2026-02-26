package com.zipddak.seller.repository;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Expression;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.dto.CategoryDto;
import com.zipddak.dto.ProductDto;
import com.zipddak.dto.ProductOptionDto;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QProductOption;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.seller.dto.SearchConditionDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SellerProductRepository {
	
	private final JPAQueryFactory jpaQueryFactory;
	
	//셀러가 등록한 상품의 카테고리만 조회 
	public List<CategoryDto> findSellerCategories(String sellerUsername) {

        QProduct product = QProduct.product;
        QCategory category = QCategory.category;

        return jpaQueryFactory.select(Projections.fields(CategoryDto.class,
							                        category.categoryIdx,
							                        category.name))
				                .distinct()
				                .from(product)
				                .join(category).on(product.categoryIdx.eq(category.categoryIdx))
				                .where(product.sellerUsername.eq(sellerUsername))
				                .orderBy(category.name.asc())
				                .fetch();
    }

	//특정 셀러가 등록한 상품 리스트 
	public List<ProductDto> searchMyProducts(PageRequest pageRequest, SearchConditionDto scDto, String sellerUsername) {

        QProduct product = QProduct.product;
        QProductFile thumb = QProductFile.productFile;
        QReviewProduct review = QReviewProduct.reviewProduct;
        
        
        Expression<Long> reviewCount = JPAExpressions.select(review.reviewProductIdx.count())
										                .from(review)
										                .where(review.productIdx.eq(product.productIdx));
        
        Expression<Double> reviewAvgScore = JPAExpressions.select(review.score.avg().coalesce(0.0))
											                .from(review)
											                .where(review.productIdx.eq(product.productIdx));
        
        
        List<ProductDto> result = jpaQueryFactory.select(Projections.fields(ProductDto.class,
									                        product.productIdx,
									                        product.sellerUsername,
									                        product.name,
									                        product.thumbnailFileIdx,
									                        product.categoryIdx,
									                        product.subCategoryIdx,
									                        product.price,
									                        product.salePrice,
									                        product.visibleYn,
									                        product.createdAt,
									                        thumb.fileRename.as("thumbnailFileRename"),
									                        
									                        ExpressionUtils.as(reviewCount, "reviewCount"),
								                            
									                        ExpressionUtils.as(reviewAvgScore, "reviewAvgScore")
									                ))
									                .from(product)
									                .leftJoin(thumb).on(thumb.productFileIdx.eq(product.thumbnailFileIdx))
									                .where(product.deletedYn.isFalse(),
									                		product.sellerUsername.eq(sellerUsername),
									                		QPredicate.eq(product.sellerUsername, scDto.getSellerUsername()),
									                		QPredicate.inBoolean(product.visibleYn, scDto.getVisibleList()),
									                	    QPredicate.inInt(product.categoryIdx, scDto.getCategoryList()),
									                	    QPredicate.contains(product.name, scDto.getKeyword()))
									                .orderBy(product.productIdx.desc())
									                .offset(pageRequest.getOffset())
									                .limit(pageRequest.getPageSize())
									                .fetch();

        return result;
    }

	//특정 셀러가 등록한 상품 수 
    public Long countMyProducts(SearchConditionDto scDto) {

        QProduct product = QProduct.product;

        return jpaQueryFactory.select(product.count())
				                .from(product)
				                .where(product.deletedYn.isFalse(),
				                        QPredicate.eq(product.sellerUsername, scDto.getSellerUsername()),
				                        QPredicate.inBoolean(product.visibleYn, scDto.getVisibleList()),
				                        QPredicate.inInt(product.categoryIdx, scDto.getCategoryList()),
				                        QPredicate.contains(product.name, scDto.getKeyword()))
				                .fetchOne();
    }
    
    
    //등록상품 상세보기 (옵션 제외) 
	public ProductDto findByProductIdxAndSellerId(String sellerUsername, Integer productIdx) {
		QProduct product = QProduct.product;
		
		QProductFile thumb = new QProductFile("thumb");
		QProductFile img1  = new QProductFile("img1");
		QProductFile img2  = new QProductFile("img2");
		QProductFile img3  = new QProductFile("img3");
		QProductFile img4  = new QProductFile("img4");
		QProductFile img5  = new QProductFile("img5");
		QProductFile dt1   = new QProductFile("dt1");
		QProductFile dt2   = new QProductFile("dt2");
		
		return jpaQueryFactory.select(Projections.fields(ProductDto.class,
								                product.productIdx,
								                product.sellerUsername,
								                product.name,
								                product.thumbnailFileIdx,
								                product.image1FileIdx,
								                product.image2FileIdx,
								                product.image3FileIdx,
								                product.image4FileIdx,
								                product.image5FileIdx,
								                product.detail1FileIdx,
								                product.detail2FileIdx,
								                product.categoryIdx,
								                product.subCategoryIdx,
								                product.price,
								                product.salePrice,
								                product.discount,
								                product.optionYn,
								                product.postYn,
								                product.postType.stringValue().as("postType"),
								                product.postCharge,
								                product.pickupYn,
								                product.zonecode,
								                product.pickupAddr1,
								                product.pickupAddr2,
								                product.visibleYn,
								                product.createdAt,
								                thumb.fileRename.as("thumbnailFileRename"),
								                img1.fileRename.as("image1FileRename"),
								                img2.fileRename.as("image2FileRename"),
								                img3.fileRename.as("image3FileRename"),
								                img4.fileRename.as("image4FileRename"),
								                img5.fileRename.as("image5FileRename"),
								                dt1.fileRename.as("detail1FileRename"),
								                dt2.fileRename.as("detail2FileRename")
								        ))
								        .from(product)
								        .leftJoin(thumb).on(thumb.productFileIdx.eq(product.thumbnailFileIdx))
								        .leftJoin(img1).on(img1.productFileIdx.eq(product.image1FileIdx))
								        .leftJoin(img2).on(img2.productFileIdx.eq(product.image2FileIdx))
								        .leftJoin(img3).on(img3.productFileIdx.eq(product.image3FileIdx))
								        .leftJoin(img4).on(img4.productFileIdx.eq(product.image4FileIdx))
								        .leftJoin(img5).on(img5.productFileIdx.eq(product.image5FileIdx))
								        .leftJoin(dt1).on(dt1.productFileIdx.eq(product.detail1FileIdx))
								        .leftJoin(dt2).on(dt2.productFileIdx.eq(product.detail2FileIdx))
								        .where(product.sellerUsername.eq(sellerUsername),
								        		product.productIdx.eq(productIdx))
								        .fetchOne();
	}
	//등록상품의 옵션 
	public List<ProductOptionDto> findByProductOptions(Integer productIdx) {
		QProductOption pdOption   = QProductOption.productOption;
		
		return jpaQueryFactory.select(Projections.fields(ProductOptionDto.class,
												pdOption.productOptionIdx,
									            pdOption.name,
									            pdOption.value,
									            pdOption.price
									    ))
									    .from(pdOption)
									    .where(pdOption.product.productIdx.eq(productIdx))
									    .fetch();
	}

	
	
}	
	
	
	
	
	
