package com.zipddak.user.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zipddak.entity.FavoritesProduct;
import com.zipddak.entity.FavoritesTool;
import com.zipddak.repository.FavoritesProductRepository;
import com.zipddak.repository.FavoritesToolRepository;

@Service
public class FavoriteToolServiceImpl implements FavoriteToolService {
	
	@Autowired
	private FavoritesToolRepository favoriteToolRepository;
	
	@Autowired
	private FavoritesProductRepository favoriteProductRepository;

	//좋아요
	@Override
	public void toggleFavorite(Integer toolIdx, String username) {
		
		Optional<FavoritesTool> favoriteTool = favoriteToolRepository.findByUserUsernameAndToolIdx(username,toolIdx);
		// 이미 존재할때는 db에서 제거
		if(favoriteTool.isPresent()) {
			favoriteToolRepository.deleteById(favoriteTool.get().getFavoriteIdx());
		}else { // 존재하지 않으니 db에 추가
			favoriteToolRepository.save(FavoritesTool.builder()
					.toolIdx(toolIdx)
					.userUsername(username)
					.build());
		}
	}

	//좋아요 조회
	@Override
	public Boolean isHeartTool(Integer toolIdx, String username) {
		
		Optional<FavoritesTool> favoriteTool = favoriteToolRepository.findByUserUsernameAndToolIdx(username,toolIdx);
		
		if(favoriteTool.isPresent()) {
			return true;
		}		
		
		return false;
	}

	//상품 좋아요 조회
	@Override
	public Boolean isHeartProduct(Integer productIdx, String username) {
		
		Optional<FavoritesProduct> favoriteProduct = favoriteProductRepository.findByUserUsernameAndProductIdx(username, productIdx);
		
		if(favoriteProduct.isPresent()) {
			return true;
		}		
		
		return false;
	}

}
