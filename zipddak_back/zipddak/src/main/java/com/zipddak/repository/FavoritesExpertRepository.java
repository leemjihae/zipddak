package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.FavoritesExpert;

public interface FavoritesExpertRepository extends JpaRepository<FavoritesExpert, Integer> {

	Optional<FavoritesExpert> findByUserUsernameAndExpertIdx(String username, Integer expertIdx);
}
