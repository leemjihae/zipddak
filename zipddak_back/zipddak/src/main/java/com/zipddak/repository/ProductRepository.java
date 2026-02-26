package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
	
	//seller 상품 조회 
	Optional<Product> findByProductIdxAndSellerUsername(Integer productIdx, String sellerUsername);


}
