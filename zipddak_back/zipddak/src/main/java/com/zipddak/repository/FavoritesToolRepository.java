package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.FavoritesTool;

public interface FavoritesToolRepository extends JpaRepository<FavoritesTool, Integer> {

	Optional<FavoritesTool> findByUserUsernameAndToolIdx(String username, Integer toolIdx);
}
