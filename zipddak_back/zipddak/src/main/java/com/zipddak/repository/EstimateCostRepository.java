package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.EstimateCost;

public interface EstimateCostRepository extends JpaRepository<EstimateCost, Integer> {
	List<EstimateCost> findByEstimateIdx(Integer estimateIdx);
	
	void deleteByEstimateIdx(Integer estimateIdx);
}
