package com.zipddak.mypage.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zipddak.entity.Category;
import com.zipddak.entity.Estimate;
import com.zipddak.entity.Expert;
import com.zipddak.entity.ExpertFile;
import com.zipddak.entity.Message;
import com.zipddak.entity.MessageRoom;
import com.zipddak.entity.ProfileFile;
import com.zipddak.entity.Tool;
import com.zipddak.entity.User;
import com.zipddak.mypage.dto.ChatMessageDto;
import com.zipddak.mypage.dto.ChatMessageResponseDto;
import com.zipddak.mypage.dto.CreateMessageRoomRequestDto;
import com.zipddak.mypage.dto.MessageRoomListDto;
import com.zipddak.mypage.dto.MessageRoomListDto.MessageRoomListDtoBuilder;
import com.zipddak.mypage.dto.MessageRoomUpdateDto;
import com.zipddak.repository.CategoryRepository;
import com.zipddak.repository.EstimateRepository;
import com.zipddak.repository.ExpertFileRepository;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.MessageRepository;
import com.zipddak.repository.MessageRoomRepository;
import com.zipddak.repository.ProfileFileRepository;
import com.zipddak.repository.ToolRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

	private final MessageRepository messageRepository;
	private final MessageRoomRepository messageRoomRepository;
	private final ToolRepository toolRepository;
	private final EstimateRepository estimateRepository;
	private final UserRepository userRepository;
	private final ExpertRepository expertRepository;
	private final ProfileFileRepository profileFileRepository;
	private final ExpertFileRepository expertFileRepository;
	private final CategoryRepository categoryRepository;

	// 채팅 목록
	@Override
	public List<MessageRoomListDto> getMessageRoomList(String username, String type) throws Exception {
		List<MessageRoom> rooms = messageRoomRepository.findByRecvUsernameOrSendUsernameOrderByUpdatedAtDesc(username,
				username);

		return rooms.stream().map(room -> toDto(room, username, type)).collect(Collectors.toList());
	}

	// MessageRoom → MessageRoomListDto 변환
	private MessageRoomListDto toDto(MessageRoom room, String username, String type) {

		Long unreadCount = messageRepository
				.countByMessageRoomIdxAndRecvUsernameAndConfirmFalse(room.getMessageRoomIdx(), username);

		MessageRoomListDtoBuilder builder = MessageRoomListDto.builder().messageRoomIdx(room.getMessageRoomIdx())
				.lastMessage(room.getLastMessage()).updatedAt(room.getUpdatedAt()).unreadCount(unreadCount)
				.roomRecvUsername(room.getRecvUsername()).roomSendUsername(room.getSendUsername());

		// type 기준 분기
		if (type.equals("TOOL")) {
			return buildToolDto(builder, room, username);
		} else if (type.equals("EXPERT")) {
			return buildExpertDto(builder, room);
		} else {
			return buildNotuserDto(builder, room, username);
		}
	}

	// TOOL 타입 채팅방 DTO 구성
	private MessageRoomListDto buildToolDto(MessageRoomListDtoBuilder builder, MessageRoom room, String username) {

		Tool tool = toolRepository.findById(room.getToolIdx()).orElseThrow();

		// 상대방 username
		String otherUsername = room.getSendUsername().equals(username) ? room.getRecvUsername()
				: room.getSendUsername();
		User user = userRepository.findById(otherUsername).orElseThrow();

		ProfileFile profileFile = profileFileRepository.findById(user.getProfileImg()).orElseThrow();

		return builder.toolIdx(tool.getToolIdx()).toolName(tool.getName()).nickname(user.getNickname())
				.userProfileImage(profileFile.getFileRename()).build();
	}

	// EXPERT 타입 채팅방 DTO 구성
	private MessageRoomListDto buildExpertDto(MessageRoomListDtoBuilder builder, MessageRoom room) {

		Estimate estimate = estimateRepository.findById(room.getEstimateIdx()).get();

		Expert expert = expertRepository.findById(estimate.getExpert().getExpertIdx()).get();
		
		// 파일이 존재하는지 체크하는 변수
		boolean flag = false;
		
		Optional<ExpertFile> expertFile = null;
		
		if(expert.getProfileImageIdx() != null) {
			expertFile = expertFileRepository.findById(expert.getProfileImageIdx());
			flag = true;
		}
		
		Category category = categoryRepository.findById(expert.getMainServiceIdx()).get();

		MessageRoomListDto createRoomDto = builder.estimateIdx(estimate.getEstimateIdx()).activityName(expert.getActivityName())
				.mainService(category.getName()).addr1(expert.getAddr1())
				.build();
		
		if(flag) createRoomDto.setExpertProfileImage(expertFile.get().getFileRename());
		
		return createRoomDto;
	}

	// NOTUSER 타입 채팅방 DTO 구성
	private MessageRoomListDto buildNotuserDto(MessageRoomListDtoBuilder builder, MessageRoom room, String username) {

		// 상대방 username
		String otherUsername = room.getSendUsername().equals(username) ? room.getRecvUsername()
				: room.getSendUsername();
		
		System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@");
		
		System.out.println(otherUsername);
		
		User user = userRepository.findById(otherUsername).orElseThrow();

		Integer imageNo = user.getProfileImg();
		
		if(imageNo!=null) {
			ProfileFile profileFile = profileFileRepository.findById(user.getProfileImg()).get();;
			return builder.nickname(user.getNickname()).userProfileImage(profileFile.getFileRename()).estimateIdx(room.getEstimateIdx()).build();			
		} else {
			return builder.nickname(user.getNickname()).estimateIdx(room.getEstimateIdx()).build();			
		}

		
	}

	// 채팅방 목록 즉시 업데이트
	@Override
	public ChatMessageResponseDto saveMessageAndUpdateRoom(ChatMessageDto chatMessageDto) throws Exception {
		// 메시지 저장
		Message message = messageRepository.save(Message.builder().messageRoomIdx(chatMessageDto.getMessageRoomIdx())
				.content(chatMessageDto.getContent()).sendUsername(chatMessageDto.getSendUsername())
				.recvUsername(chatMessageDto.getRecvUsername()).sendButton(chatMessageDto.getSendButton()).confirm(false).build());

		Message saved = messageRepository.save(message);

		// 채팅방 업데이트
		MessageRoom room = messageRoomRepository.findById(chatMessageDto.getMessageRoomIdx()).orElseThrow();

		room.setLastMessage(saved.getContent());
		room.setLastSender(saved.getSendUsername());
		room.setUpdatedAt(saved.getCreatedAt());

		messageRoomRepository.save(room);

		return ChatMessageResponseDto.builder().messageIdx(saved.getMessageIdx())
				.messageRoomIdx(saved.getMessageRoomIdx()).content(saved.getContent())
				.sendUsername(saved.getSendUsername()).recvUsername(saved.getRecvUsername())
				.sendButton(saved.getSendButton()).confirm(saved.getConfirm()).createdAt(saved.getCreatedAt()).build();
	}

	@Override
	public MessageRoomUpdateDto buildRoomUpdate(ChatMessageResponseDto msg) throws Exception {
		MessageRoom room = messageRoomRepository.findById(msg.getMessageRoomIdx()).orElseThrow();

		// 받는 사람 기준 unread count
		Long unreadCount = messageRepository
				.countByMessageRoomIdxAndRecvUsernameAndConfirmFalse(room.getMessageRoomIdx(), msg.getRecvUsername());

		return MessageRoomUpdateDto.builder().messageRoomIdx(room.getMessageRoomIdx())
				.lastMessage(room.getLastMessage()).updatedAt(room.getUpdatedAt()).unreadCount(unreadCount).build();
	}

	// 채팅방 대화 목록
	@Transactional
	@Override
	public List<ChatMessageResponseDto> getMessageDetailList(Integer messageRoomIdx, String username) throws Exception {
		List<Message> messages = messageRepository.findByMessageRoomIdxOrderByCreatedAtAsc(messageRoomIdx);

		markAsReadWithSetter(messageRoomIdx, username);

		return messages.stream()
				.map(m -> ChatMessageResponseDto.builder().messageIdx(m.getMessageIdx())
						.messageRoomIdx(m.getMessageRoomIdx()).content(m.getContent()).sendUsername(m.getSendUsername())
						.recvUsername(m.getRecvUsername()).sendButton(m.getSendButton()).confirm(m.getConfirm())
						.createdAt(m.getCreatedAt()).build())
				.collect(Collectors.toList());
	}

	public void markAsReadWithSetter(Integer messageRoomIdx, String username) {

		List<Message> unreadMessages = messageRepository
				.findByMessageRoomIdxAndRecvUsernameAndConfirmFalse(messageRoomIdx, username);

		for (Message m : unreadMessages) {
			m.setConfirm(true);
		}
	}

	// 채팅방 생성
	@Override
	public Integer createOrGetMessageRoom(CreateMessageRoomRequestDto createMessageRoomRequestDto) throws Exception {
		Optional<MessageRoom> messageRoom = messageRoomRepository.findExistingRoom(
				createMessageRoomRequestDto.getType(), createMessageRoomRequestDto.getSendUsername(),
				createMessageRoomRequestDto.getRecvUsername(), createMessageRoomRequestDto.getToolIdx(),
				createMessageRoomRequestDto.getEstimateIdx());

		if (messageRoom.isPresent()) {
			return messageRoom.get().getMessageRoomIdx();
		}

		MessageRoom room = MessageRoom.builder().type(createMessageRoomRequestDto.getType())
				.sendUsername(createMessageRoomRequestDto.getSendUsername())
				.recvUsername(createMessageRoomRequestDto.getRecvUsername())
				.toolIdx(createMessageRoomRequestDto.getToolIdx())
				.estimateIdx(createMessageRoomRequestDto.getEstimateIdx()).lastMessage(null).build();

		messageRoomRepository.save(room);
		return room.getMessageRoomIdx();
	}
}
