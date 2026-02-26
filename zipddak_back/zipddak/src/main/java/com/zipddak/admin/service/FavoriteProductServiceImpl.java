package com.zipddak.admin.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zipddak.entity.FavoritesProduct;
import com.zipddak.repository.FavoritesProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteProductServiceImpl implements FavoriteProductService {

	private final FavoritesProductRepository favoriteProductRepository;
	
	@Override
	public void toggleFavorite(Integer productIdx, String username) {
		
		Optional<FavoritesProduct> favoriteProduct = favoriteProductRepository.findByProductIdxAndUserUsername(productIdx, username);
		// 이미 존재할때는 db에서 제거
		if(favoriteProduct.isPresent()) {
			favoriteProductRepository.deleteById(favoriteProduct.get().getFavoriteIdx());
		}else { // 존재하지 않으니 db에 추가
			favoriteProductRepository.save(FavoritesProduct.builder()
					.productIdx(productIdx)
					.userUsername(username)
					.build());
		}

	}

}
