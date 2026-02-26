package com.zipddak.admin.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.SellerInfoDto;
import com.zipddak.admin.repository.SellerInfoDslRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerInfoServiceImpl implements SellerInfoService{

	private final SellerInfoDslRepository sellerInfoDslRepository;
	
	@Override
	public SellerInfoDto getSellerInfo(Integer sellerId) throws Exception {

		return sellerInfoDslRepository.getSellerInfo(sellerId);
	}

	// 베스트 상품 리스트
	@Override
	public List<ProductCardDto> bestProductList(Integer sellerId, String username) throws Exception {

		PageInfo pageInfo = new PageInfo(1);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 4);
		
		return sellerInfoDslRepository.bestProductList(pageRequest, sellerId, username);
	}

	// 일반 상품 리스트
	@Override
	public List<ProductCardDto> productList(int categoryNo, int page, Integer sellerId, String username) throws Exception {
		
		PageInfo pageInfo = new PageInfo(page);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 16);
		
		return sellerInfoDslRepository.productList(categoryNo, pageRequest, sellerId, username);
	}

}
