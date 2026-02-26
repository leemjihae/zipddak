package com.zipddak.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRoomDto {
	private Integer messageRoomIdx;
	private String type; 
	private Integer toolIdx;
	private Integer estimateIdx;
	private String recvUsername;
	private String sendUsername;
	private String lastMessage;
	private String lastSender;
	private Timestamp createdAt;
	private Timestamp updatedAt;
}
