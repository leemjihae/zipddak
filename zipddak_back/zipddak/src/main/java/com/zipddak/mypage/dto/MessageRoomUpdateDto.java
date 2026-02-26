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
public class MessageRoomUpdateDto {
	private Integer messageRoomIdx;
	private String lastMessage;
	private Timestamp updatedAt;
	private Long unreadCount;
}
