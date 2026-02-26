package com.zipddak.mypage.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.ReviewExpertDto;
import com.zipddak.dto.ReviewProductDto;
import com.zipddak.dto.ReviewToolDto;
import com.zipddak.mypage.dto.BeforeExpertReviewDto;
import com.zipddak.mypage.dto.BeforeProductReviewDto;
import com.zipddak.mypage.dto.BeforeToolReviewDto;
import com.zipddak.mypage.dto.MyExpertReviewDto;
import com.zipddak.mypage.dto.MyProductReviewDto;
import com.zipddak.mypage.dto.MyToolReviewDto;

public interface ReviewService {
	// 후기 작성가능한 대여목록
	List<BeforeToolReviewDto> beforeToolReviewList(String username) throws Exception;

	// 후기 작성가능한 매칭목록
	List<BeforeExpertReviewDto> beforeExpertReviewList(String username) throws Exception;

	// 후기 작성가능한 구매목록
	List<BeforeProductReviewDto> beforeProductReviewList(String username) throws Exception;

	// 대여 후기 작성
	void writeToolReview(ReviewToolDto reviewTooldto, MultipartFile[] reviewImages) throws Exception;

	// 매칭 후기 작성
	void writeExpertReview(ReviewExpertDto reviewExpertdto, MultipartFile[] reviewImages) throws Exception;

	// 구매 후기 작성
	void writeProductReview(ReviewProductDto reviewProductdto, MultipartFile[] reviewImages) throws Exception;

	// 대여 후기 수정
	void modifyToolReview(ReviewToolDto reviewTooldto, MultipartFile[] reviewImages) throws Exception;

	// 매칭 후기 수정
	void modifyExpertReview(ReviewExpertDto reviewExpertdto, MultipartFile[] reviewImages) throws Exception;

	// 구매 후기 수정
	void modifyProductReview(ReviewProductDto reviewProductdto, MultipartFile[] reviewImages) throws Exception;

	// 대여 후기 삭제
	void deleteToolReview(Integer reivewToolIdx) throws Exception;

	// 매칭 후기 삭제
	void deleteExpertReview(Integer reivewExpertIdx) throws Exception;

	// 구매 후기 삭제
	void deleteProductReview(Integer reivewProductIdx) throws Exception;

	// 작성한 대여 후기목록
	List<MyToolReviewDto> myToolReviewList(String username) throws Exception;

	// 작성한 매칭 후기목록
	List<MyExpertReviewDto> myExpertReviewList(String username) throws Exception;

	// 작성한 구매 후기목록
	List<MyProductReviewDto> myProductReviewList(String username) throws Exception;

	// 받은 대여 후기목록
	List<MyToolReviewDto> receiveToolReviewList(String username) throws Exception;

}
