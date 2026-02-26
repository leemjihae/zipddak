package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.zipddak.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
	List<Notification> findByRecvUsernameAndConfirmFalse(String username);
}
