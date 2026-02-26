package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.FavoritesProduct;

public interface FavoritesProductRepository extends JpaRepository<FavoritesProduct, Integer> {

	Optional<FavoritesProduct> findByUserUsernameAndProductIdx(String username, Integer productIdx);
	
	Optional<FavoritesProduct> findByProductIdxAndUserUsername(Integer productIdx, String userUsername);
}
