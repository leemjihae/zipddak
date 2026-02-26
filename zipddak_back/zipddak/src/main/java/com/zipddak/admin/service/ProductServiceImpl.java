package com.zipddak.admin.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.ColorOption;
import com.zipddak.admin.dto.LastOrderResponseDto;
import com.zipddak.admin.dto.OptionListDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.OrderListResponseDto;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.ProductDetailDto;
import com.zipddak.admin.dto.ProductDetailResponseDto;
import com.zipddak.admin.dto.ProductInquiriesDto;
import com.zipddak.admin.dto.ProductReviewsDto;
import com.zipddak.admin.repository.ProductDslRepository;
import com.zipddak.dto.ProductOptionDto;
import com.zipddak.dto.UserDto;
import com.zipddak.entity.FavoritesProduct;
import com.zipddak.repository.FavoritesProductRepository;
import com.zipddak.repository.InquiriesRepository;
import com.zipddak.repository.ProductOptionRepository;
import com.zipddak.repository.ReviewProductRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
	
	private final ProductDslRepository productDslRepository;
	
	private final ReviewProductRepository reviewProductRepository;
	private final ProductOptionRepository productOptionRepository;
	private final InquiriesRepository inquiriesRepository;
	private final FavoritesProductRepository favoriteProductRepository;

	@Override
	public List<ProductCardDto> productList(String keyword, PageInfo pageInfo, Integer sortId, Integer cate1, Integer cate2, String username) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 16);
		return productDslRepository.productList(keyword, pageRequest, sortId, cate1, cate2, username);
		
	}

	// 상품 정보들을 포함한 map 반환
	@Override
	public ProductDetailResponseDto productInfo(Integer productId, String username) throws Exception {

		// 상품 정보
		ProductDetailDto productDetailDto = productDslRepository.productInfo(productId);	
		
		// 처음 상품 디테일 페이지에서 리뷰, 문의를 각각 5개씩 불러옴
		PageInfo pageInfo = new PageInfo(1); // 처음 페이지 1로 고정
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 5); // 5개씩
		
		
		// 상품 리뷰 리스트
		List<ProductReviewsDto> productReviews = productDslRepository.productReviews(productId, pageRequest);


		// 상품 문의 리스트		
		List<ProductInquiriesDto> productInquiries = productDslRepository.productInquiries(productId, pageRequest);
		

		// 평점
		Double avgScore = reviewProductRepository.findAvgByProductIdx(productId);
		
		
		// 리뷰 수
		Long reviewCount = reviewProductRepository.countByProductIdx(productId);
		
		// 문의 수
		Long inquiryCount = inquiriesRepository.countByProductIdxAndAnswerIsNotNull(productId);
		
		// 상품 옵션
		List<ProductOptionDto> productOptions = productOptionRepository.findByProduct_ProductIdx(productId).stream().map(option -> option.toProductOptionDto()).collect(Collectors.toList());
		
		// 관심 유무
		boolean favorite;
		
		Optional<FavoritesProduct> favoriteProduct = favoriteProductRepository.findByProductIdxAndUserUsername(productId, username);
		favorite = favoriteProduct.isPresent() ? true : false; 
		
		Map<String, List<ColorOption>> productOption = new HashMap<String, List<ColorOption>>();
		for(ProductOptionDto option : productOptions) {
			// 옵션명
			String name = option.getName();
			// 값 -> 색상
			String color = option.getValue();
			Long price = option.getPrice();
			Integer optionId = option.getProductOptionIdx();
			
			// 옵션명을 key로 색상리스트를 value로 저장하는 map
			// computeIfAbsent -> key가 map에 없으면 새로운 arrayList를 만들어서 value를 넣고 있으면 기존 리스트를 가져옴
			productOption.computeIfAbsent(name, k -> new ArrayList<>())
				.add(new ColorOption(optionId, price, color));
		}

		// DTO 조립 후 반환
		return ProductDetailResponseDto.builder()
				.productDetailDto(productDetailDto)
				.productReviews(productReviews)
				.productInquiries(productInquiries)
				.avgScore(avgScore)
				.reviewCount(reviewCount)
				.productOption(productOption)
				.inquiryCount(inquiryCount)
				.favorite(favorite)
				.build();
		
	}

	// 추가 리뷰
	@Override
	public List<ProductReviewsDto> moreReview(Integer productId, Integer page) throws Exception {
		
		PageInfo pageInfo = new PageInfo(page);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 5); // 5개씩
		
		return productDslRepository.productReviews(productId, pageRequest);
	}

	// 추가 문의
	@Override
	public List<ProductInquiriesDto> moreInquiry(Integer productId, Integer page) throws Exception {
		
		PageInfo pageInfo = new PageInfo(page);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 5); // 5개씩
		
		return productDslRepository.productInquiries(productId, pageRequest);
	}

	// 구매 목록 상품 정보 반환
	@Override
	public OrderListResponseDto getOrderList(List<OrderListDto> orderList) {

		// 자재 id는 같음
		Integer productId = orderList.get(0).getProductId();
		
		OrderListResponseDto orderListResponseDto = productDslRepository.orderListResponse(productId);
		
//		System.out.println(orderListResponseDto);
		
		List<OptionListDto> optionList = new ArrayList<OptionListDto>();
		
		// 구매목록을 돌아서 개수를 제외한 옵션 정보를 queryDsl을 통해서 가져오고
		// 개수는 set으로 주입
		for(OrderListDto orderListDto : orderList) {
			OptionListDto requestOption = productDslRepository.requestOptions(orderListDto.getOptionId());
			requestOption.setCount(orderListDto.getCount());
			
			optionList.add(requestOption);
		}
		
		orderListResponseDto.setOrderList(optionList);
		
		return orderListResponseDto;
	}

	// 구매하려는 사용자의 정보를 가져와서 전화번호, 이름 뿌려주기
	@Override
	public UserDto getUserInfo(String username) {

		return productDslRepository.getUserInfo(username);
	}

	// 테스트
	@Override
	public LastOrderResponseDto getTestList(List<OrderListDto> orderList) {
		
		return productDslRepository.getTestList(orderList);
	}


}
