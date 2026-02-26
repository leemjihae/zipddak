package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Refund;

public interface RefundRepository extends JpaRepository<Refund, Integer> {

	Refund findByOrderIdx(Integer orderIdx);

}
