package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.User;

public interface UserRepository extends JpaRepository<User, String>{
	
	Optional<User> findByProviderIdAndProvider(String providerId, String provider);
	Optional<User> findByProviderId (String providerId);
	
}
