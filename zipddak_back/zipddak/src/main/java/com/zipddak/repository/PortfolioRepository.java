package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {

}
