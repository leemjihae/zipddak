package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMessageRoomRequestDto {
	private String type;          // TOOL | EXPERT
    private String sendUsername;  // 요청자
    private String recvUsername;  // 상대방
    private Integer toolIdx;      // type == TOOL
    private Integer estimateIdx;  // type == EXPERT
}
