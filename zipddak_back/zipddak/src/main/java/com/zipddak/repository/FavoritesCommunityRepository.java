package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.FavoritesCommunity;

public interface FavoritesCommunityRepository extends JpaRepository<FavoritesCommunity, Integer> {

	Optional<FavoritesCommunity> findByUserUsernameAndCommunityIdx(String username, Integer communityIdx);
	
	long countByCommunityIdx(Integer communityIdx);
}
