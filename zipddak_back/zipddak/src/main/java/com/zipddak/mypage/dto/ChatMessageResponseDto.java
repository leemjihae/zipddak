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
public class ChatMessageResponseDto {
	private Integer messageIdx;
	private Integer messageRoomIdx;
	private String content;
	private String sendUsername;
	private String recvUsername;
	private Boolean sendButton;
	private Boolean confirm;
	private Timestamp createdAt;
}
