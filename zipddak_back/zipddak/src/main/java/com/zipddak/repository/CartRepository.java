package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer>{

	Optional<Cart> findByProduct_ProductIdxAndUserUsernameAndOptionIdx(Integer productId, String username,
			Integer optionId);

}
