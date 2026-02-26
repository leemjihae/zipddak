package com.zipddak.admin.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zipddak.entity.FavoritesCommunity;
import com.zipddak.repository.FavoritesCommunityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteCommunityImpl implements FavoriteCommunity{
	
	private final FavoritesCommunityRepository favoritesCommunityRepository;

	@Override
	public boolean isFavorite(int communityId, String username) throws Exception {

		Optional<FavoritesCommunity> favorite = favoritesCommunityRepository.findByUserUsernameAndCommunityIdx(username, communityId);
		
		return favorite.isPresent() ? true : false;
		
	}

	@Override
	public long favoriteCount(int communityId) throws Exception {
		
		return favoritesCommunityRepository.countByCommunityIdx(communityId);
	}

	@Override
	public void favoriteToggle(String username, Integer communityId) throws Exception {
		
		Optional<FavoritesCommunity> favorite = favoritesCommunityRepository.findByUserUsernameAndCommunityIdx(username, communityId);
		
		if(favorite.isPresent()) {
			favoritesCommunityRepository.delete(favorite.get());
		}else {
			FavoritesCommunity fa = FavoritesCommunity.builder()
										.userUsername(username)
										.communityIdx(communityId)
										.build();
			
			favoritesCommunityRepository.save(fa);
		}
		
	}
	
	

}
