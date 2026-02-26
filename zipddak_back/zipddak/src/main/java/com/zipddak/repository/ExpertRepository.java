package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.google.common.base.Optional;
import com.zipddak.entity.Expert;

public interface ExpertRepository extends JpaRepository<Expert, Integer> {
	Optional<Expert> findByUser_Username(String username);
	
}
