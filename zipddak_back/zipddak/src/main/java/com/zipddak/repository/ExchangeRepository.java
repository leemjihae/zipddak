package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Exchange;

public interface ExchangeRepository extends JpaRepository<Exchange, Integer> {

}
