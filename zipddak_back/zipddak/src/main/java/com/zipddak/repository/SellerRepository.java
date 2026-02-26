package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Seller;
import com.zipddak.entity.User;

public interface SellerRepository extends JpaRepository<Seller, Integer> {

	Optional<Seller> findByUser_Username(String username);


}
