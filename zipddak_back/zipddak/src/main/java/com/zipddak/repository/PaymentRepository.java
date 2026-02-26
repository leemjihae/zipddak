package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer>{

	Payment findByOrderId(String rentalCode);

}
