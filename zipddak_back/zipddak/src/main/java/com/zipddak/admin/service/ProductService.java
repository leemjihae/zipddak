package com.zipddak.admin.service;

import java.util.List;
import java.util.Map;

import com.zipddak.admin.dto.LastOrderResponseDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.OrderListResponseDto;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.ProductDetailResponseDto;
import com.zipddak.admin.dto.ProductInquiriesDto;
import com.zipddak.admin.dto.ProductReviewsDto;
import com.zipddak.dto.UserDto;
import com.zipddak.util.PageInfo;

public interface ProductService {
	List<ProductCardDto> productList(String keyword, PageInfo pageInfo, Integer sortId, Integer cate1, Integer cate2, String username) throws Exception;

	ProductDetailResponseDto productInfo(Integer productId, String username) throws Exception;

	List<ProductReviewsDto> moreReview(Integer productId, Integer page) throws Exception;

	List<ProductInquiriesDto> moreInquiry(Integer productId, Integer page) throws Exception;

	OrderListResponseDto getOrderList(List<OrderListDto> orderList);

	UserDto getUserInfo(String username);

	LastOrderResponseDto getTestList(List<OrderListDto> orderList);
}
