package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.SellerInfoDto;

public interface SellerInfoService {

	SellerInfoDto getSellerInfo(Integer sellerId) throws Exception;

	List<ProductCardDto> bestProductList(Integer sellerId, String username) throws Exception;

	List<ProductCardDto> productList(int categoryNo, int page, Integer sellerId, String username) throws Exception;

}
