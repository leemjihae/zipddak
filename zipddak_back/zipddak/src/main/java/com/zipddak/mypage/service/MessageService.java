package com.zipddak.mypage.service;

import com.zipddak.mypage.dto.ChatMessageDto;
import com.zipddak.mypage.dto.ChatMessageResponseDto;
import com.zipddak.mypage.dto.CreateMessageRoomRequestDto;
import com.zipddak.mypage.dto.MessageRoomListDto;
import com.zipddak.mypage.dto.MessageRoomUpdateDto;

import java.util.List;

public interface MessageService {
	public List<MessageRoomListDto> getMessageRoomList(String username, String type) throws Exception;

	public ChatMessageResponseDto saveMessageAndUpdateRoom(ChatMessageDto chatMessageDto) throws Exception;
	
	public MessageRoomUpdateDto buildRoomUpdate(ChatMessageResponseDto msg) throws Exception;

	public List<ChatMessageResponseDto> getMessageDetailList(Integer messageRoomIdx, String username) throws Exception;

	public Integer createOrGetMessageRoom(CreateMessageRoomRequestDto createMessageRoomRequestDto) throws Exception;
}
