package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.OrderItem;
import com.zipddak.entity.OrderItem.OrderStatus;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
	List<OrderItem> findByOrderIdx(Integer orderIdx);
	
	//해당 주문의 해당 itemIdx 목록만 조회 (주문 소속 검증+현재 OrderStatus 확인)
	List<OrderItem> findOrderItemsByOrderIdxAndOrderItemIdxIn(Integer orderIdx, List<Integer> itemIdxs); 

	List<OrderItem> findByRefundIdx(Integer refundIdx);

	boolean existsByOrderIdxAndOrderStatusNot(Integer orderIdx, OrderStatus status);
}
