package com.zipddak.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.LastOrderResponseDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.OrderListResponseDto;
import com.zipddak.admin.dto.OrderListWrapperDto;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.ProductDetailResponseDto;
import com.zipddak.admin.dto.ProductInquiriesDto;
import com.zipddak.admin.dto.ProductReviewsDto;
import com.zipddak.admin.service.FavoriteProductService;
import com.zipddak.admin.service.ProductService;
import com.zipddak.dto.UserDto;

import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ProductController {
	
	private final ProductService productService;
	private final FavoriteProductService favoriteProductService;

	// 자재 리스트 조회
	@GetMapping("productList")
	public ResponseEntity<List<ProductCardDto>> productList(
			@RequestParam(required = false) String keyword,
			@RequestParam(defaultValue = "1") Integer page,
			@RequestParam(required = false, defaultValue = "1") Integer sortId,
			@RequestParam("cate1") Integer cate1,
			@RequestParam(required = false) Integer cate2,
			@RequestParam(required = false) String username) {
		
		try {
			
			System.out.println("page : " + page);
			
				PageInfo pageInfo = new PageInfo(page);
				List<ProductCardDto> productList = productService.productList(keyword, pageInfo, sortId, cate1, cate2, username);
				
				return ResponseEntity.ok(productList);

		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 상품 상세
	@GetMapping("product")
	public ResponseEntity<ProductDetailResponseDto> productInfo(@RequestParam("productId") Integer productId, @RequestParam("username") String username){
		
		try {
			ProductDetailResponseDto productInfo = productService.productInfo(productId, username);
			
			return ResponseEntity.ok(productInfo);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 상품 리뷰 더보기
	@GetMapping("reviews")
	public ResponseEntity<List<ProductReviewsDto>> moreReview(@RequestParam("productId") Integer productId, @RequestParam("page") Integer page) {
		try {
			List<ProductReviewsDto> reviewList = productService.moreReview(productId, page);
			return ResponseEntity.ok(reviewList);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	// 상품 문의 더보기
	@GetMapping("inquiries")
	public ResponseEntity<List<ProductInquiriesDto>> moreInquiry(@RequestParam("productId") Integer productId, @RequestParam("page") Integer page) {
		try {
			List<ProductInquiriesDto> inquiryList = productService.moreInquiry(productId, page);
			return ResponseEntity.ok(inquiryList);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	// 관심 상품 토글
	@PostMapping("user/favoriteToggle")
	public ResponseEntity<Void> favoriteToggle(@RequestBody Map<String, Object> requestMap){
		
		String username = (String)requestMap.get("username");
		Integer productIdx = (Integer)requestMap.get("productIdx");
		
		// DB에서 업데이트
		favoriteProductService.toggleFavorite(productIdx, username);
		
		return ResponseEntity.ok().build();
				
	}
	
//	// 구매 목록의 상품 정보
//	@PostMapping("orderListProduct")
//	public ResponseEntity<OrderListResponseDto> orderListProduct(@RequestBody OrderListWrapperDto orderListWrapperDto){
//		
//		try {
//			
//			// 반환할 데이터의 구조
//			// 1. 자재 업체 이름
//			// 2. 배송비
//			// 3. 자재 명
//			// 4. 판매 가격
//			// 5. 리스트 (옵션명, 선택값, 옵션가격 + 판매가격, 개수)
//			
//			// 요청 파라미터에서 꺼내야하는 데이터
//			// 1. 자재 상품 id
//			// 2. 옵션 id
//			// 3. 개수
//			
//			
//			List<OrderListDto> orderList = orderListWrapperDto.getOrderList();
//			OrderListResponseDto orderListResponseDto = productService.getOrderList(orderList);
//			
//			UserDto userInfo = productService.getUserInfo(orderListWrapperDto.getUsername());
//			
//			// 전화번호에서 010이랑 - 잘라주기
//			String phone = userInfo.getPhone();
//			phone = phone.replaceAll("-", "");
//			phone = phone.substring(3);
//			
//			userInfo.setPhone(phone);
//			
//			orderListResponseDto.setUserInfo(userInfo);
//			
//			return ResponseEntity.ok(orderListResponseDto);
//		}catch(Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.badRequest().body(null);
//		}
//		
//	}
//	
	
	// 구매 목록의 상품 정보
		@PostMapping("user/orderListProduct2")
		public ResponseEntity<LastOrderResponseDto> orderListProduct2(@RequestBody OrderListWrapperDto orderListWrapperDto){
			
			try {
				
				// 리스트 안에
				// userDto가 들어가야하고
				// 리스트인데 브랜드별 상품 목록이 들어가야함
				
				List<OrderListDto> orderList = orderListWrapperDto.getOrderList();
				LastOrderResponseDto lastOrderResponseDto = productService.getTestList(orderList);
				
				UserDto userInfo = productService.getUserInfo(orderListWrapperDto.getUsername());
				
				// 전화번호에서 010이랑 - 잘라주기
				String phone = userInfo.getPhone();
				if(phone != null && !phone.equals("")) {
					phone = phone.replaceAll("-", "");
					phone = phone.substring(3);
					userInfo.setPhone(phone);
				}
				
				
				lastOrderResponseDto.setUserInfo(userInfo);
				
				return ResponseEntity.ok(lastOrderResponseDto);
			}catch(Exception e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(null);
			}
			
		}
	
	
	
	
	
}