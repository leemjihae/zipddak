package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zipddak.entity.Career;

public interface CareerRepository extends JpaRepository<Career, Integer>{

	List<Career> findByExpertIdx(Integer expertIdx);

	@Query("SELECT COALESCE(SUM(c.months), 0) FROM Career c WHERE c.expertIdx = :expertIdx")
	Long getTotalMonthsByExpertIdx(@Param("expertIdx") Integer expertIdx);

	
}
