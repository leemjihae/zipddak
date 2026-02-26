package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Inquiries;

public interface InquiriesRepository extends JpaRepository<Inquiries, Integer>{

	long countByProductIdxAndAnswerIsNotNull(Integer productId);
}
