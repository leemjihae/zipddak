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
public class MessageRoomListDto {
	private Integer messageRoomIdx; // 채팅방 아이디
	private String lastMessage; // 마지막 내용
	private Timestamp updatedAt; // 마지막 전송일
	private Long unreadCount; // 미확인 채팅 개수
	private String roomRecvUsername; // 버튼 보내는 주체
	private String roomSendUsername; 

	/* type == TOOL */
	private Integer toolIdx; // 공구 아이디
	private String nickname; // 닉네임
	private String userProfileImage; // 프로필 이미지
	private String toolName; // 공구명

	/* type == EXPERT */
	private Integer estimateIdx; // 견적서 아이디
	private String activityName; // 전문가 활동명
	private String expertProfileImage; // 프로필 이미지
	private String mainService; // 대표 카테고리
	private String addr1; // 활동 지역

}
