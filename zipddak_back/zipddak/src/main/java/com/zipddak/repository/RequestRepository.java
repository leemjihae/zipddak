package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Request;

public interface RequestRepository extends JpaRepository<Request, Integer>{
	Optional<Request> findByUserUsernameAndStatus(String username, String status) throws Exception;
}
