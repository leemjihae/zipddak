package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Matching;

public interface MatchingRepository extends JpaRepository<Matching, Integer>{

	Matching findByMatchingCode(String asText);

	Optional<Matching> findFirstByEstimateIdxOrderByMatchingIdxDesc(Integer estimateIdx);

}
