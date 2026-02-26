package com.zipddak.mypage.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.zipddak.mypage.dto.ChatMessageDto;
import com.zipddak.mypage.dto.ChatMessageResponseDto;
import com.zipddak.mypage.dto.CreateMessageRoomRequestDto;
import com.zipddak.mypage.dto.MessageRoomListDto;
import com.zipddak.mypage.dto.MessageRoomUpdateDto;
import com.zipddak.mypage.service.MessageServiceImpl;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {

	private final SimpMessagingTemplate messagingTemplate;
	private final MessageServiceImpl messageService;

	// 채팅 전송
	@MessageMapping("/chat/send")
	public void sendMessage(@Payload ChatMessageDto chatMessageDto) {
		if (chatMessageDto.getMessageRoomIdx() == null || chatMessageDto.getSendUsername() == null
				|| chatMessageDto.getRecvUsername() == null || chatMessageDto.getContent() == null) {
			return;
		}

		try {
			ChatMessageResponseDto response = messageService.saveMessageAndUpdateRoom(chatMessageDto);

			// 구독 중인 클라이언트에게 전달
			messagingTemplate.convertAndSend("/topic/chat/room/" + chatMessageDto.getMessageRoomIdx(), response);

			// db 저장 + room 갱신
			MessageRoomUpdateDto roomUpdate = messageService.buildRoomUpdate(response);

			// 채팅방 목록 갱신 (보낸 사람 & 받는 사람)
			messagingTemplate.convertAndSend("/topic/chat/rooms/" + chatMessageDto.getSendUsername(), roomUpdate);
			messagingTemplate.convertAndSend("/topic/chat/rooms/" + chatMessageDto.getRecvUsername(), roomUpdate);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// 채팅방 목록 조회
	@GetMapping("/messageRoomList")
	public ResponseEntity<List<MessageRoomListDto>> messageRoomList(@RequestParam("username") String username,
			@RequestParam("type") String type) {
		try {
			return ResponseEntity.ok(messageService.getMessageRoomList(username, type));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 채팅방 대화 상세 조회
	@GetMapping("/messages")
	public ResponseEntity<List<ChatMessageResponseDto>> getMessages(@RequestParam Integer messageRoomIdx,
			@RequestParam String username) {
		try {
			return ResponseEntity.ok(messageService.getMessageDetailList(messageRoomIdx, username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 채팅방 생성
	@PostMapping("/message-room")
	public ResponseEntity<Integer> createOrGetMessageRoom(
			@RequestBody CreateMessageRoomRequestDto createMessageRoomRequestDto) {
		try {
			Integer roomId = messageService.createOrGetMessageRoom(createMessageRoomRequestDto);
			System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
			System.out.println(roomId);
			return ResponseEntity.ok(roomId);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	@MessageExceptionHandler
	public void handleMessageException(Throwable e) {
		System.err.println("STOMP ERROR");
		e.printStackTrace();
	}
}
