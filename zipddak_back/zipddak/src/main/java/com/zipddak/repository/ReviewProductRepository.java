package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.zipddak.entity.ReviewProduct;

public interface ReviewProductRepository extends JpaRepository<ReviewProduct, Integer> {

    long countByProductIdx(Integer productIdx);

    @Query("SELECT AVG(r.score) FROM ReviewProduct r WHERE r.productIdx = :productIdx")
    Double findAvgByProductIdx(@Param("productIdx") Integer productIdx);

}
