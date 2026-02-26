package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
	private Integer messageRoomIdx;
    private String content;
    private String sendUsername;
    private String recvUsername;
    private Boolean sendButton;
}
