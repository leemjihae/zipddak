package com.zipddak.mypage.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
import com.zipddak.mypage.service.ReviewServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewServiceImpl reviewService;

	// 후기 작성가능한 대여목록
	@GetMapping("/beforeReviewList/tool")
	public ResponseEntity<List<BeforeToolReviewDto>> beforeToolReviewList(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.beforeToolReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 후기 작성가능한 매칭목록
	@GetMapping("/beforeReviewList/expert")
	public ResponseEntity<List<BeforeExpertReviewDto>> beforeExpertReviewList(
			@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.beforeExpertReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 후기 작성가능한 구매목록
	@GetMapping("/beforeReviewList/product")
	public ResponseEntity<List<BeforeProductReviewDto>> beforeProductReviewList(
			@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.beforeProductReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 대여 후기 작성
	@PostMapping("/review/write/tool")
	public ResponseEntity<Boolean> writeToolReview(ReviewToolDto reviewToolDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages) {
		try {
			reviewService.writeToolReview(reviewToolDto, reviewImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 매칭 후기 작성
	@PostMapping("/review/write/expert")
	public ResponseEntity<Boolean> writeExpertReview(ReviewExpertDto reviewExpertDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages) {
		try {
			reviewService.writeExpertReview(reviewExpertDto, reviewImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 구매 후기 작성
	@PostMapping("/review/write/product")
	public ResponseEntity<Boolean> writeProductReview(ReviewProductDto reviewProductDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages) {
		try {
			reviewService.writeProductReview(reviewProductDto, reviewImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 대여 후기 수정
	@PostMapping("/review/modify/tool")
	public ResponseEntity<Boolean> modifyToolReview(ReviewToolDto reviewToolDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages) {
		try {
			reviewService.modifyToolReview(reviewToolDto, reviewImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 매칭 후기 수정
	@PostMapping("/review/modify/expert")
	public ResponseEntity<Boolean> modifyExpertReview(ReviewExpertDto reviewExpertDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages) {
		try {
			reviewService.modifyExpertReview(reviewExpertDto, reviewImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 구매 후기 수정
	@PostMapping("/review/modify/product")
	public ResponseEntity<Boolean> modifyProductReview(ReviewProductDto reviewProductDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages) {
		try {
			reviewService.modifyProductReview(reviewProductDto, reviewImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 대여 후기 삭제
	@PostMapping("/review/delete/tool")
	public ResponseEntity<Boolean> deleteToolReview(@RequestBody Map<String, Integer> req) {
		try {
			reviewService.deleteToolReview(req.get("reviewToolIdx"));
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 매칭 후기 삭제
	@PostMapping("/review/delete/expert")
	public ResponseEntity<Boolean> deleteExpertReview(@RequestBody Map<String, Integer> req) {
		try {
			System.out.print("파라미터값" + req.get("reviewExpertIdx"));
			reviewService.deleteExpertReview(req.get("reviewExpertIdx"));
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 구매 후기 삭제
	@PostMapping("/review/delete/product")
	public ResponseEntity<Boolean> deleteProductReview(@RequestBody Map<String, Integer> req) {
		try {
			reviewService.deleteProductReview(req.get("reviewProductIdx"));
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 작성한 대여 후기목록
	@GetMapping("/reviewList/tool")
	public ResponseEntity<List<MyToolReviewDto>> myToolReviewList(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.myToolReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 작성한 매칭 후기목록
	@GetMapping("/reviewList/expert")
	public ResponseEntity<List<MyExpertReviewDto>> myExpertReviewList(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.myExpertReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 작성한 구매 후기목록
	@GetMapping("/reviewList/product")
	public ResponseEntity<List<MyProductReviewDto>> myProductReviewList(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.myProductReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 받은 대여 후기목록
	@GetMapping("/receive/reviewList/tool")
	public ResponseEntity<List<MyToolReviewDto>> receiveToolReviewList(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(reviewService.receiveToolReviewList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
}
