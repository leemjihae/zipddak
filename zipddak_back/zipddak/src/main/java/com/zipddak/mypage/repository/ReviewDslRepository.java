package com.zipddak.mypage.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.QCategory;
import com.zipddak.entity.QEstimate;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QMatching;
import com.zipddak.entity.QOrder;
import com.zipddak.entity.QOrderItem;
import com.zipddak.entity.QProduct;
import com.zipddak.entity.QProductFile;
import com.zipddak.entity.QRental;
import com.zipddak.entity.QReviewExpert;
import com.zipddak.entity.QReviewFile;
import com.zipddak.entity.QReviewProduct;
import com.zipddak.entity.QReviewTool;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QTool;
import com.zipddak.entity.QToolFile;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.BeforeExpertReviewDto;
import com.zipddak.mypage.dto.BeforeProductReviewDto;
import com.zipddak.mypage.dto.BeforeToolReviewDto;
import com.zipddak.mypage.dto.MyExpertReviewDto;
import com.zipddak.mypage.dto.MyProductReviewDto;
import com.zipddak.mypage.dto.MyToolReviewDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReviewDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 작성한 대여 후기목록
	public List<MyToolReviewDto> selectMyToolReviewList(String username) throws Exception {

		QReviewTool reviewTool = QReviewTool.reviewTool;
		QReviewFile reviewFile1 = new QReviewFile("reviewFile1");
		QReviewFile reviewFile2 = new QReviewFile("reviewFile2");
		QReviewFile reviewFile3 = new QReviewFile("reviewFile3");
		QUser user = QUser.user;
		QTool tool = QTool.tool;
		QToolFile toolFile = QToolFile.toolFile;

		return jpaQueryFactory
				.select(Projections.constructor(MyToolReviewDto.class, reviewTool.reviewToolIdx, reviewTool.score,
						reviewTool.content, reviewFile1.fileRename, reviewFile2.fileRename, reviewFile3.fileRename,
						reviewTool.img1, reviewTool.img2, reviewTool.img3, reviewTool.createdate, tool.name,
						toolFile.fileRename, user.nickname))
				.from(reviewTool).leftJoin(reviewFile1).on(reviewFile1.reviewFileIdx.eq(reviewTool.img1))
				.leftJoin(reviewFile2).on(reviewFile2.reviewFileIdx.eq(reviewTool.img2)).leftJoin(reviewFile3)
				.on(reviewFile3.reviewFileIdx.eq(reviewTool.img3)).leftJoin(user).on(user.username.eq(username))
				.leftJoin(tool).on(tool.toolIdx.eq(reviewTool.toolIdx)).leftJoin(toolFile)
				.on(toolFile.toolFileIdx.eq(tool.thunbnail)).where(reviewTool.writer.eq(username)).fetch();
	}

	// 작성한 매칭 후기목록
	public List<MyExpertReviewDto> selectMyExpertReviewList(String username) throws Exception {

		QReviewExpert reviewExpert = QReviewExpert.reviewExpert;
		QReviewFile reviewFile1 = new QReviewFile("reviewFile1");
		QReviewFile reviewFile2 = new QReviewFile("reviewFile2");
		QReviewFile reviewFile3 = new QReviewFile("reviewFile3");
		QEstimate estimate = QEstimate.estimate;
		QCategory category = QCategory.category;
		QExpert expert = QExpert.expert;
		QExpertFile expertFile = QExpertFile.expertFile;

		return jpaQueryFactory
				.select(Projections.constructor(MyExpertReviewDto.class, reviewExpert.reviewExpertIdx,
						reviewExpert.score, reviewExpert.content, reviewFile1.fileRename, reviewFile2.fileRename,
						reviewFile3.fileRename, reviewExpert.img1, reviewExpert.img2, reviewExpert.img3,
						reviewExpert.createdate, expert.activityName, expertFile.fileRename, category.name))
				.from(reviewExpert).leftJoin(reviewFile1).on(reviewFile1.reviewFileIdx.eq(reviewExpert.img1))
				.leftJoin(reviewFile2).on(reviewFile2.reviewFileIdx.eq(reviewExpert.img2)).leftJoin(reviewFile3)
				.on(reviewFile3.reviewFileIdx.eq(reviewExpert.img3)).leftJoin(estimate)
				.on(estimate.expert.expertIdx.eq(reviewExpert.expertIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(estimate.largeServiceIdx)).leftJoin(expert)
				.on(expert.expertIdx.eq(reviewExpert.expertIdx)).leftJoin(expertFile)
				.on(expertFile.expertFileIdx.eq(expert.profileImageIdx)).where(reviewExpert.writer.eq(username))
				.fetch();
	}

	// 작성한 구매 후기목록
	public List<MyProductReviewDto> selectMyProductReviewList(String username) throws Exception {

		QReviewProduct reviewProduct = QReviewProduct.reviewProduct;
		QReviewFile reviewFile1 = new QReviewFile("reviewFile1");
		QReviewFile reviewFile2 = new QReviewFile("reviewFile2");
		QReviewFile reviewFile3 = new QReviewFile("reviewFile3");
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		QProductFile productFile = QProductFile.productFile;

		return jpaQueryFactory
				.select(Projections.constructor(MyProductReviewDto.class, reviewProduct.reviewProductIdx,
						reviewProduct.score, reviewProduct.content, reviewFile1.fileRename, reviewFile2.fileRename,
						reviewFile3.fileRename, reviewProduct.img1, reviewProduct.img2, reviewProduct.img3,
						reviewProduct.createdate, seller.brandName, productFile.fileRename, product.name))
				.from(reviewProduct).leftJoin(reviewFile1).on(reviewFile1.reviewFileIdx.eq(reviewProduct.img1))
				.leftJoin(reviewFile2).on(reviewFile2.reviewFileIdx.eq(reviewProduct.img2)).leftJoin(reviewFile3)
				.on(reviewFile3.reviewFileIdx.eq(reviewProduct.img3)).leftJoin(product)
				.on(product.productIdx.eq(reviewProduct.productIdx)).leftJoin(seller)
				.on(seller.user.username.eq(product.sellerUsername)).leftJoin(productFile)
				.on(productFile.productFileIdx.eq(product.thumbnailFileIdx)).where(reviewProduct.writer.eq(username))
				.fetch();
	}

	// 받은 대여 후기목록
	public List<MyToolReviewDto> selectReceiveToolReviewList(String username) throws Exception {

		QReviewTool reviewTool = QReviewTool.reviewTool;
		QReviewFile reviewFile1 = new QReviewFile("reviewFile1");
		QReviewFile reviewFile2 = new QReviewFile("reviewFile2");
		QReviewFile reviewFile3 = new QReviewFile("reviewFile3");
		QUser user = QUser.user;
		QTool tool = QTool.tool;
		QToolFile toolFile = QToolFile.toolFile;

		return jpaQueryFactory
				.select(Projections.constructor(MyToolReviewDto.class, reviewTool.reviewToolIdx, reviewTool.score,
						reviewTool.content, reviewFile1.fileRename, reviewFile2.fileRename, reviewFile3.fileRename,
						reviewTool.img1, reviewTool.img2, reviewTool.img3, reviewTool.createdate, tool.name,
						toolFile.fileRename, user.nickname))
				.from(reviewTool).leftJoin(tool).on(tool.toolIdx.eq(reviewTool.toolIdx)).leftJoin(reviewFile1)
				.on(reviewFile1.reviewFileIdx.eq(reviewTool.img1)).leftJoin(reviewFile2)
				.on(reviewFile2.reviewFileIdx.eq(reviewTool.img2)).leftJoin(reviewFile3)
				.on(reviewFile3.reviewFileIdx.eq(reviewTool.img3)).leftJoin(user)
				.on(user.username.eq(reviewTool.writer)).leftJoin(toolFile).on(toolFile.toolFileIdx.eq(tool.thunbnail))
				.where(tool.owner.eq(username)).fetch();
	}

	// 후기 작성가능한 대여목록
	public List<BeforeToolReviewDto> selectBeforeToolReview(String username) throws Exception {
		QReviewTool reviewTool = QReviewTool.reviewTool;
		QRental rental = QRental.rental;
		QTool tool = QTool.tool;
		QUser user = QUser.user;
		QToolFile toolFile = QToolFile.toolFile;

		return jpaQueryFactory
				.select(Projections.constructor(BeforeToolReviewDto.class, tool.name, toolFile.fileRename,
						user.nickname, tool.toolIdx, rental.rentalIdx))
				.from(rental).leftJoin(tool).on(tool.toolIdx.eq(rental.tool.toolIdx)).leftJoin(reviewTool)
				.on(reviewTool.rentalIdx.eq(rental.rentalIdx)).leftJoin(user).on(user.username.eq(rental.owner))
				.leftJoin(toolFile).on(toolFile.toolFileIdx.eq(tool.thunbnail))
				.where(rental.borrower.eq(username), reviewTool.reviewToolIdx.isNull()).fetch();
	}

	// 후기 작성가능한 매칭목록
	public List<BeforeExpertReviewDto> selectBeforeExpertReview(String username) throws Exception {
		QReviewExpert reviewExpert = QReviewExpert.reviewExpert;
		QExpert expert = QExpert.expert;
		QMatching matching = QMatching.matching;
		QEstimate estimate = QEstimate.estimate;
		QCategory category = QCategory.category;
		QExpertFile expertFile = QExpertFile.expertFile;

		return jpaQueryFactory
				.select(Projections.constructor(BeforeExpertReviewDto.class, expert.activityName, expertFile.fileRename,
						category.name, expert.expertIdx, matching.matchingIdx))
				.from(matching).leftJoin(expert).on(expert.expertIdx.eq(matching.expertIdx)).leftJoin(reviewExpert)
				.on(reviewExpert.matchingIdx.eq(matching.matchingIdx)).leftJoin(expertFile)
				.on(expertFile.expertFileIdx.eq(expert.profileImageIdx)).leftJoin(estimate)
				.on(estimate.estimateIdx.eq(matching.estimateIdx)).leftJoin(category)
				.on(category.categoryIdx.eq(estimate.largeServiceIdx))
				.where(matching.userUsername.eq(username), reviewExpert.reviewExpertIdx.isNull()).fetch();
	}

	// 후기 작성가능한 구매목록
	public List<BeforeProductReviewDto> selectBeforeProductReview(String username) throws Exception {
		QReviewProduct reviewProduct = QReviewProduct.reviewProduct;
		QOrder order = QOrder.order;
		QOrderItem orderItem = QOrderItem.orderItem;
		QProduct product = QProduct.product;
		QSeller seller = QSeller.seller;
		QProductFile productFile = QProductFile.productFile;

		return jpaQueryFactory
				.select(Projections.constructor(BeforeProductReviewDto.class, seller.brandName, productFile.fileRename,
						product.name, product.productIdx, orderItem.orderItemIdx))
				.from(orderItem).leftJoin(order).on(order.user.username.eq(username)).leftJoin(product)
				.on(product.productIdx.eq(orderItem.product.productIdx)).leftJoin(seller)
				.on(seller.user.username.eq(product.sellerUsername)).leftJoin(productFile)
				.on(productFile.productFileIdx.eq(product.thumbnailFileIdx)).leftJoin(reviewProduct)
				.on(reviewProduct.orderItemIdx.eq(orderItem.orderItemIdx))
				.where(orderItem.orderIdx.eq(order.orderIdx), reviewProduct.reviewProductIdx.isNull()).fetch();
	}
}
