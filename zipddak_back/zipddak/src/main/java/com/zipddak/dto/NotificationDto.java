package com.zipddak.dto;

import java.sql.Timestamp;

import com.zipddak.entity.Notification.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
	private Integer notificationIdx;
	private NotificationType type;
	private String title;
	private String content;
	private String recvUsername;
	private String sendUsername;
	private Integer rentalIdx;
	private Integer estimateIdx;
	private Integer requestIdx;
	private String reviewType; // 'TOOL','PRODUCT','EXPERT'
	private Integer reviewIdx;
	private Integer communityIdx;
	private Boolean confirm;
	private Timestamp createDate;
}
