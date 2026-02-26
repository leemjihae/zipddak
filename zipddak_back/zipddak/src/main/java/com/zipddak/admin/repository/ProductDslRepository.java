package com.zipddak.admin.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.BrandDto;
import com.zipddak.admin.dto.CartBrandDto;
import com.zipddak.admin.dto.CartProductDetailDto;
import com.zipddak.admin.dto.LastOrderResponseDto;
import com.zipddak.admin.dto.OptionDto;
import com.zipddak.admin.dto.OptionListDto;
import com.zipddak.admin.dto.OrderItemsDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.OrderListResponseDto;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.ProductDetailDto;
import com.zipddak.admin.dto.ProductInquiriesDto;
import com.zipddak.admin.dto.ProductReviewsDto;
import com.zipddak.dto.OrderDto;
import com.zipddak.dto.UserDto;
import com.zipddak.entity.Cart;
import com.zipddak.entity.Product;
import com.zipddak.entity.ProductFile;
import com.zipddak.entity.ProductOption;
import com.zipddak.entity.QCart;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QFavoritesProduct;
import com.zipddak.entity.QInquiries;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QProductOption;
import com.zipddak.entity.QReviewFile;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QUser;
import com.zipddak.entity.Seller;

@Repository
public class ProductDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	// ProductCardDto 타입으로 반환
	// 자재 상품 목록 조회
	public List<ProductCardDto> productList(String keyword, PageRequest pageRequest, Integer sortId, Integer cate1,
			Integer cate2, String username) throws Exception {

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
		// 상품 카테고리
		QCategory category = QCategory.category;

		// 정렬조건
		// 1 -> 인기순
		// 2 -> 최신순
		// 3 -> 낮은 가격순
		// 4 -> 높은 가격순

		// 카테고리
		// 카테고리가 1이나 2일경우
		// cate2까지 보여주기

		// 카테고리가 3 이상일 경우
		// cate2는 없음

		// 로그인 했을때 안했을때 구분
		Expression<Boolean> isFavoriteExpr =
			    Expressions.booleanTemplate("false").as("favorite");

			if (username != null && !username.equals("")) {
			    isFavoriteExpr =
			        new CaseBuilder()
			            .when(favorite.productIdx.isNotNull()).then(true)
			            .otherwise(false)
			            .as("favorite");
			}


		BooleanBuilder where = new BooleanBuilder();

		// 상품 공개 유무가 1인 상품만
		where.and(product.visibleYn.eq(true));
		
		// 주방 욕실인 경우
		if (cate1 == 1 || cate1 == 6) {
			if (cate2 == 1) { // 전체 경우
				where.and(product.categoryIdx.eq(cate1));
			} else { // 중분류가 있을 경우
				where.and(product.categoryIdx.eq(cate1)).and(product.subCategoryIdx.eq(cate2));
			}
		} else { // 나머지 카테고리인 경우
			where.and(product.categoryIdx.eq(cate1));
		}

		if (keyword != null && !keyword.isBlank()) {
			where.and(product.name.contains(keyword));
		}

		List<OrderSpecifier<?>> orders = new ArrayList<>();

		switch (sortId) {
		case 1: // 인기순 (판매량 많은 순)
		    orders.add(orderItem.quantity.sum().coalesce(0).desc());
		    break;

		case 2: // 최신순
		    orders.add(product.createdAt.desc());
		    break;

		case 3: // 가격 낮은순
		    orders.add(product.salePrice.asc());
		    break;

		case 4: // 가격 높은순
		    orders.add(product.salePrice.desc());
		    break;

		default: // 평점 높은순
		    orders.add(review.score.avg().coalesce(0.0).desc());
		}

		orders.add(product.productIdx.desc());
		
		
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
				.orderBy(orders.toArray(new OrderSpecifier[0])).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize()).fetch();

	}

	// 상품 상세 정보
	public ProductDetailDto productInfo(Integer productId) {

		QProduct product = QProduct.product;
		QCategory category1 = new QCategory("category1");
		QCategory category2 = new QCategory("category2");

		QSeller seller = QSeller.seller;
		
		QProductFile thumbnail = new QProductFile("thumbnail");
		QProductFile img1 = new QProductFile("img1");
		QProductFile img2 = new QProductFile("img2");
		QProductFile img3 = new QProductFile("img3");
		QProductFile img4 = new QProductFile("img4");
		QProductFile img5 = new QProductFile("img5");
		QProductFile detailImg1 = new QProductFile("detailImg1");
		QProductFile detailImg2 = new QProductFile("detailImg2");
		
		return jpaQueryFactory.select(Projections.bean(ProductDetailDto.class, 
					category1.name.as("category"),
					category2.name.as("subCategory"),
					product.productIdx,
					product.name,
					product.discount,
					product.price,
					product.salePrice,
					product.postCharge,
					product.optionYn,
					product.postType,
					product.postYn,
					product.pickupYn,
					product.zonecode,
					product.pickupAddr1,
					product.pickupAddr2,
					seller.brandName,
					seller.sellerIdx,
					thumbnail.fileRename.as("thumbnail"),
					img1.fileRename.as("img1"),
					img2.fileRename.as("img2"),
					img3.fileRename.as("img3"),
					img4.fileRename.as("img4"),
					img5.fileRename.as("img5"),
					detailImg1.fileRename.as("detailImg1"),
					detailImg2.fileRename.as("detailImg2")
				))
				.from(product)
				.leftJoin(category1).on(category1.categoryIdx.eq(product.categoryIdx))
				.leftJoin(category2).on(category2.categoryIdx.eq(product.subCategoryIdx))
				.leftJoin(seller).on(seller.user.username.eq(product.sellerUsername))
				.leftJoin(thumbnail).on(thumbnail.productFileIdx.eq(product.thumbnailFileIdx))
				.leftJoin(img1).on(img1.productFileIdx.eq(product.image1FileIdx))
				.leftJoin(img2).on(img2.productFileIdx.eq(product.image2FileIdx))
				.leftJoin(img3).on(img3.productFileIdx.eq(product.image3FileIdx))
				.leftJoin(img4).on(img4.productFileIdx.eq(product.image4FileIdx))
				.leftJoin(img5).on(img5.productFileIdx.eq(product.image5FileIdx))
				.leftJoin(detailImg1).on(detailImg1.productFileIdx.eq(product.detail1FileIdx))
				.leftJoin(detailImg2).on(detailImg2.productFileIdx.eq(product.detail2FileIdx))
				.where(product.productIdx.eq(productId))
				.fetchFirst();
	}

	// 해당 상품에 해당하는 문의 불러오기
	public List<ProductInquiriesDto> productInquiries(Integer productId, PageRequest pageRequest) {

		// 문의
		QInquiries inquiries = QInquiries.inquiries;
		// 글쓴이
		QUser user = QUser.user;
		// 상품
		QProduct product = QProduct.product;
		// 판매업체
		QSeller seller = QSeller.seller;
		
		return jpaQueryFactory.select(Projections.bean(ProductInquiriesDto.class,
				inquiries.inquiryIdx,
				user.nickname.as("writerNickname"),
				inquiries.content,
				inquiries.answer,
				inquiries.writeAt,
				inquiries.answerAt,
				seller.brandName
				))
				.from(inquiries)
				.leftJoin(user).on(inquiries.writerUsername.eq(user.username))
				.leftJoin(product).on(inquiries.productIdx.eq(product.productIdx))
				.leftJoin(seller).on(product.sellerUsername.eq(seller.user.username))
				.where(product.productIdx.eq(productId).and(inquiries.answer.isNotNull()))
				.orderBy(inquiries.answerAt.desc()).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize())
				.fetch();
	}

	// 해당 상품에 해당하는 리뷰 불러오기
	public List<ProductReviewsDto> productReviews(Integer productId, PageRequest pageRequest) {

		QReviewProduct reviewProduct = QReviewProduct.reviewProduct;
		QUser user = QUser.user;
		QReviewFile file1 = new QReviewFile("file1");
		QReviewFile file2 = new QReviewFile("file2");
		QReviewFile file3 = new QReviewFile("file3");

		return jpaQueryFactory
				.select(Projections.bean(ProductReviewsDto.class, reviewProduct.reviewProductIdx, reviewProduct.score,
						reviewProduct.content, reviewProduct.createdate, user.nickname,
						file1.fileRename.as("img1Name"),
						file2.fileRename.as("img2Name"),
						file3.fileRename.as("img3Name"),
						file1.storagePath.as("img1Path"),
						file2.storagePath.as("img2Path"),
						file3.storagePath.as("img3Path")))
				.from(reviewProduct)
				.leftJoin(user).on(reviewProduct.writer.eq(user.username))
				.leftJoin(file1).on(reviewProduct.img1.eq(file1.reviewFileIdx))
				.leftJoin(file2).on(reviewProduct.img2.eq(file2.reviewFileIdx))
				.leftJoin(file3).on(reviewProduct.img3.eq(file3.reviewFileIdx))
				.where(reviewProduct.productIdx.eq(productId))
				.orderBy(reviewProduct.createdate.desc()).offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize()).fetch();
	}

	// 구매 목록의 자재 정보
	public OrderListResponseDto orderListResponse(Integer productId) {

		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		
		return jpaQueryFactory.select(Projections.bean(OrderListResponseDto.class, 
					product.productIdx.as("productId"),
					product.name.as("productName"),
					product.postCharge,
					product.salePrice,
					seller.brandName
				))
				.from(product)
				.leftJoin(seller).on(product.sellerUsername.eq(seller.user.username))
				.where(product.productIdx.eq(productId))
				.fetchFirst();
	}

	// 옵션에 대한 정보를 반환해야함
	public OptionListDto requestOptions(Integer optionId) {

		QProductOption productOption = QProductOption.productOption;

		return jpaQueryFactory
				.select(Projections.bean(OptionListDto.class, productOption.productOptionIdx.as("optionId"),
						productOption.name, productOption.value, productOption.price))
				.from(productOption).where(productOption.productOptionIdx.eq(optionId)).fetchOne();
	}

	// 사용자에 대한 정보 이름, 전화번호만 리턴
	public UserDto getUserInfo(String username) {

		QUser user = QUser.user;

		return jpaQueryFactory.select(Projections.bean(UserDto.class,
				user.name,
				user.phone,
				user.addr1,
				user.addr2,
				user.zonecode
				)).from(user)
				.where(user.username.eq(username)).fetchOne();
	}

	// 자재 이름만 반환
	public String getProductName(Integer productId) {

		QProduct product = QProduct.product;

		return jpaQueryFactory.select(product.name).from(product).where(product.productIdx.eq(productId)).fetchOne();
	}

	// 자재 가격만 반환
	public long getProductPrice(Integer productId) {
		QProduct product = QProduct.product;

		return jpaQueryFactory.select(product.salePrice).from(product).where(product.productIdx.eq(productId))
				.fetchOne();
	}

	// 주문 정보 받아오기
	public OrderDto getOrderInfo(String orderCode) {

		QOrder order = QOrder.order;

		return jpaQueryFactory
				.select(Projections.bean(OrderDto.class, order.orderIdx, order.createdAt, order.phone, order.postAddr1,
						order.postAddr2, order.postRecipient, order.shippingAmount, order.subtotalAmount,
						order.totalAmount, order.postZonecode))
				.from(order).where(order.orderCode.eq(orderCode)).fetchOne();
	}
 
	// 각 주문에 해당하는 주문 상품 불러오기
	public List<OrderItemsDto> getOrderItems(Integer orderIdx) {

		QOrderItem orderItem = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QProductFile productFile = QProductFile.productFile;
		QProductOption productOption = QProductOption.productOption;

		return jpaQueryFactory.select(Projections.bean(OrderItemsDto.class, orderItem.orderItemIdx, // order_item_idx
				orderItem.quantity, // quantity
				productFile.fileRename.as("fileRename"), productFile.storagePath.as("storagePath"),
				product.name.as("productName"), product.salePrice.as("salePrice"), product.price.as("productPrice"),
				Projections.bean(OptionDto.class, // 옵션 정보 매핑
						productOption.name.as("optionName"), productOption.value.as("optionValue"),
						productOption.price.as("optionPrice")).as("option")))
				.from(orderItem).leftJoin(orderItem.product, product).leftJoin(productFile)
				.on(product.thumbnailFileIdx.eq(productFile.productFileIdx)).leftJoin(productOption)
				.on(orderItem.productOptionIdx.eq(productOption.productOptionIdx)) // 옵션 join
				.where(orderItem.orderIdx.eq(orderIdx)).fetch();
	}

	// 카트 리스트 보여주기
	public List<CartBrandDto> cartList(String username) {

		QCart cart = QCart.cart;
		QProduct product = QProduct.product;
		QProductOption productOption = QProductOption.productOption;
		QSeller seller = QSeller.seller;
		QProductFile productFile = QProductFile.productFile;
		
		// 특정 사용자에 대한 모든 장바구니 리스트 불러오기
		// Tuple -> 한번의 쿼리로 여러 엔티티 가져올수 있음
		List<Tuple> firstList = jpaQueryFactory
			    .select(cart, product, productFile, productOption, seller)
			    .from(cart)
			    .leftJoin(cart.product, product) // cart와 product 조인
			    .join(seller).on(seller.user.username.eq(product.sellerUsername))
			    .leftJoin(productFile).on(product.thumbnailFileIdx.eq(productFile.productFileIdx)) // 조인 조건
			    .join(productOption).on(cart.optionIdx.eq(productOption.productOptionIdx))       // 조인 조건
			    .where(cart.userUsername.eq(username))
			    .fetch();
		
		// 브랜드 별로 담기
		Map<Integer, List<CartProductDetailDto>> mapList = firstList.stream().map(tuple -> {
	        Cart c = tuple.get(cart);
	        Product p = tuple.get(product);
	        ProductOption o = tuple.get(productOption);
	        ProductFile f = tuple.get(productFile);
	        Seller s = tuple.get(seller);
	        
	        return new CartProductDetailDto(
	        		o.getProductOptionIdx(),
	        		p.getProductIdx(),
	        		c.getCartIdx(),
	        		f.getFileRename(),
	        		f.getStoragePath(),
	        		p.getName(),
	        		o.getName(),
	        		o.getValue(),
	        		c.getQuantity(),
	        		p.getSalePrice() == null ? 0 : p.getSalePrice(),
	        		p.getPrice(),
	        		o.getPrice(),
	        		p.getPostType(),
	        		p.getPostCharge(),
	        		s.getSellerIdx()
	        		
	        );
		}).collect(Collectors.groupingBy(CartProductDetailDto::getSellerIdx));
		
		
		List<CartBrandDto> cartOfBrand = new ArrayList<CartBrandDto>();
		
		for(Integer key : mapList.keySet()) {
			
			// 상품에 대한 정보를 먼저 넣고
			CartBrandDto cartDto = jpaQueryFactory.select(Projections.bean(CartBrandDto.class, 
							seller.sellerIdx.as("brandId"),
							seller.brandName,
							seller.freeChargeAmount,
							seller.basicPostCharge
					))
					.from(seller)
					.where(seller.sellerIdx.eq(key))
					.fetchOne();
			
			// map에 있는 productList를 key의 값으로 가져옴
			cartDto.setProductList(mapList.get(key));

			cartOfBrand.add(cartDto);
		}
		
		return cartOfBrand;
	}

	// 테스트
	public LastOrderResponseDto getTestList(List<OrderListDto> orderList) {
		
		// orderList에 들어있는 데이터
		// productId
		// optionId
		// name
		// value
		// price
		// count
		// -> 이 데이터로 가져와야하는 데이터는 브랜드별 상품목록
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller; // product.sellerUsername 과 seller.username 조인
		QProductFile file = QProductFile.productFile; // product.thumbnailFileIdx 와 file.productFileIdx 조인
		QProductOption option = QProductOption.productOption; // product.productIdx 와 option.productIdx 조인
				
	    // 1. orderList에서 productId 추출
	    List<Integer> productIds = orderList.stream()
	            .map(OrderListDto::getProductId)
	            .distinct()
	            .collect(Collectors.toList());
	    
	    // 2. QueryDSL로 상품 + 판매자 + 썸네일 정보 조회
	    List<Tuple> productTuples = jpaQueryFactory
	            .select(product, seller, file)
	            .from(product)
	            .leftJoin(seller).on(product.sellerUsername.eq(seller.user.username))
	            .leftJoin(file).on(product.thumbnailFileIdx.eq(file.productFileIdx))
	            .where(product.productIdx.in(productIds))
	            .fetch();
	    
	    // 3. 판매자별 TestDto 구성
	    Map<Integer, BrandDto> sellerMap = new HashMap<>();

	    for (Tuple tuple : productTuples) {
	    	
	    	System.out.println(tuple.get(seller));
	    	
	        Product prod = tuple.get(product);
	        Seller sel = tuple.get(seller);
	        ProductFile prodFile = tuple.get(file);
	        ProductOption prodOption = tuple.get(option);

	        int sellerIdx = sel.getSellerIdx();
	        
	        BrandDto testDto = sellerMap.get(sellerIdx);
	        if (testDto == null) {
	            testDto = new BrandDto();
	            testDto.setSellerIdx(sellerIdx);
	            testDto.setBrandName(sel.getBrandName());
	            testDto.setFreeChargeAmount(sel.getFreeChargeAmount());
	            testDto.setBasicPostCharge(sel.getBasicPostCharge());
	            testDto.setOrderList(new ArrayList<>());

	            sellerMap.put(sellerIdx, testDto);
	        }


	        // 해당 상품에 대한 옵션(orderList) 필터링
	        List<OptionListDto> options = orderList.stream()
	                .filter(o -> o.getProductId().equals(prod.getProductIdx()))
	                .map(o -> {
	                    OptionListDto optionDto = new OptionListDto();
	                    optionDto.setProductId(o.getProductId());
	                    optionDto.setOptionId(o.getOptionId());
	                    optionDto.setName(o.getName());
	                    optionDto.setValue(o.getValue());
	                    optionDto.setPrice(o.getPrice());
	                    optionDto.setCount(o.getCount());
	                    optionDto.setSalePrice(prod.getSalePrice() != null ? prod.getSalePrice() : 0); // 필요시 계산
	                    
	                    optionDto.setProductName(prod.getName());
	                    optionDto.setPostCharge(prod.getPostCharge());
	                    optionDto.setPostType(prod.getPostType());
	                    optionDto.setProductImg(prodFile.getFileRename());
	                    optionDto.setImgStoragePath(prodFile.getStoragePath());
	                    optionDto.setSellerIdx(sellerIdx);
	                    
	                    optionDto.setProductPrice(prod.getPrice());
	                    return optionDto;
	                })
	                .collect(Collectors.toList());

	        testDto.getOrderList().addAll(options);
	        sellerMap.put(sellerIdx, testDto);
	    }

	    // 4. 최종 LastOrderResponseDto 구성
	    LastOrderResponseDto response = new LastOrderResponseDto();
	    response.setBrandDto(new ArrayList<>(sellerMap.values()));

	    return response;
	}


}