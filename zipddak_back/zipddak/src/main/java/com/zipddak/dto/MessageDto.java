package com.zipddak.dto;

import java.sql.Timestamp;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private Integer messageIdx;
    private Integer messageRoomIdx;
    private String content;
    private String recvUsername;
    private String sendUsername;
    private Boolean sendButton;
    private Boolean confirm;
    private Timestamp createdAt;
}
