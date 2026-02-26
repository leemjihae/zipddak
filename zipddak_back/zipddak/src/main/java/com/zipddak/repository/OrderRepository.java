package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
	
	List<Order> findByUserUsername(String username);

	Order findByOrderCode(String orderId);
}
