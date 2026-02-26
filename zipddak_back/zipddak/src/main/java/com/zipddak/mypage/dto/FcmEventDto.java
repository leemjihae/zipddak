package com.zipddak.mypage.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FcmEventDto {
	private String eventType;   // NOTIFICATION(알림) | MESSAGE(쪽지)
	private String sendUsername;
    private String recvUsername;
    private Timestamp createdAt;
    
    // notification 용 
    private Integer notificationIdx; 
    private String notificationType;
    private String title; 
    private String content; 
    private String reviewType;
    private Integer targetId;
    
    // message 용
    private Integer messageIdx;
}
