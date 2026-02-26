package com.zipddak.admin.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zipddak.entity.FavoritesExpert;
import com.zipddak.repository.FavoritesExpertRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteExpertServiceImpl implements FavoriteExpertService{
	

	private final FavoritesExpertRepository favoritesExpertRepository;

	@Override
	public void favoriteToggle(String username, Integer expertIdx) throws Exception {
		
		Optional<FavoritesExpert> favorite = favoritesExpertRepository.findByUserUsernameAndExpertIdx(username, expertIdx);
		
		if(favorite.isPresent()) {
			favoritesExpertRepository.delete(favorite.get());
		}else {
			FavoritesExpert newFavorite = FavoritesExpert.builder()
											.userUsername(username)
											.expertIdx(expertIdx)
											.build();
			
			favoritesExpertRepository.save(newFavorite);
		}
		
	}

	@Override
	public Boolean expertFavoriteUser(Integer expertIdx, String username) {
		
		
		
		Optional<FavoritesExpert> favorite = favoritesExpertRepository.findByUserUsernameAndExpertIdx(username, expertIdx);
		
		System.out.println(expertIdx);
		System.out.println(username);
		
		System.out.println(favorite.isPresent());
		
		return favorite.isPresent() ? true : false;
	}

}
