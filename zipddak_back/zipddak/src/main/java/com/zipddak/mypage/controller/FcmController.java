package com.zipddak.mypage.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.dto.NotificationDto;
import com.zipddak.mypage.service.NotificationServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FcmController {

	private final NotificationServiceImpl notificationService;

	// 알림 목록
	@GetMapping("/notificationList")
	public ResponseEntity<List<NotificationDto>> alarms(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(notificationService.getNotificationList(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 알림 읽음 처리
	@GetMapping("/confirm/{notificationIdx}")
	public ResponseEntity<Boolean> confirmAlarm(@PathVariable Integer notificationIdx) {
		try {
			notificationService.confirmNotification(notificationIdx);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}
	}
}
