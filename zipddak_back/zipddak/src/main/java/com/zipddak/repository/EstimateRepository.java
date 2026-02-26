package com.zipddak.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Estimate;

public interface EstimateRepository extends JpaRepository<Estimate, Integer> {
	List<Estimate> findByExpert_ExpertIdx(Integer expertIdx);
}
