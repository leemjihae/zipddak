package com.zipddak.mypage.service;

import com.zipddak.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
	public void registFcmToken(String username, String fcmToken) throws Exception;
	
	public List<NotificationDto> getNotificationList(String username) throws Exception;

	public Boolean sendNotification(NotificationDto notificationDto) throws Exception;

	public Boolean confirmNotification(Integer notificationIdx) throws Exception;
}
