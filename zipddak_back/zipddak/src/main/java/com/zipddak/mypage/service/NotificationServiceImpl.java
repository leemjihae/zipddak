package com.zipddak.mypage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.zipddak.entity.Notification;
import com.zipddak.dto.NotificationDto;
import com.zipddak.entity.User;
import com.zipddak.mypage.dto.FcmEventDto;
import com.zipddak.repository.NotificationRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	private final FirebaseMessaging firebaseMessaging;
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;

	// fcmToken 세팅
	@Override
	public void registFcmToken(String username, String fcmToken) throws Exception {
		User user = userRepository.findById(username).orElseThrow(() -> new Exception("사용자 오류"));
		user.setFcmToken(fcmToken);
		userRepository.save(user);
	}

	// 알림 목록 조회
	@Override
	public List<NotificationDto> getNotificationList(String username) throws Exception {
		return notificationRepository.findByRecvUsernameAndConfirmFalse(username).stream()
				.map(notification -> modelMapper.map(notification, NotificationDto.class)).collect(Collectors.toList());
	}

	// 알림 읽음 처리
	@Override
	public Boolean confirmNotification(Integer notificationIdx) throws Exception {
		Notification notification = notificationRepository.findById(notificationIdx)
				.orElseThrow(() -> new Exception("알림번호 오류"));
		notification.setConfirm(true);
		notificationRepository.save(notification);
		return true;
	}

	// 알림 전송
	@Override
	public Boolean sendNotification(NotificationDto notificationDto) throws Exception {

		// username으로 fcmToken 가져오기
		String fcmToken = userRepository.findById(notificationDto.getRecvUsername())
				.orElseThrow(() -> new Exception("받는사람 오류")).getFcmToken();

		if (fcmToken == null || fcmToken.isEmpty()) {
			throw new Exception("Fcm Token 오류");
		}

		// Notification 테이블에 저장
		Notification notification = modelMapper.map(notificationDto, Notification.class);
		Notification saveNotification = notificationRepository.save(notification);

		// Notification -> FcmEventDto
		FcmEventDto fcmEventDto = notificationToFcmEvent(saveNotification);

		// FCM 전송
		sendFcm(fcmToken, fcmEventDto);

		return true;
	}

	// Notification -> FcmEventDto 변환
	private FcmEventDto notificationToFcmEvent(Notification notification) {

		Integer targetId = null;
		String reviewType = "";

		switch (notification.getType()) {
		case REQUEST:
			targetId = notification.getRequestIdx();
			break;
		case ESTIMATE:
			targetId = notification.getEstimateIdx();
			break;
		case COMMUNITY:
			targetId = notification.getCommunityIdx();
			break;
		case RENTAL:
			targetId = notification.getRentalIdx();
			break;
		case REVIEW:
			reviewType = notification.getReviewType();
			targetId = notification.getReviewIdx();
			break;
		}

		return FcmEventDto.builder().notificationIdx(notification.getNotificationIdx()).eventType("NOTIFICATION")
				.notificationType(notification.getType().name()).title(notification.getTitle())
				.content(notification.getContent()).sendUsername(notification.getSendUsername())
				.recvUsername(notification.getRecvUsername()).reviewType(reviewType).targetId(targetId)
				.createdAt(notification.getCreateDate()).build();
	}

	// FCM 전송
	private void sendFcm(String token, FcmEventDto fcmEventDto) throws FirebaseMessagingException {

		Message message = Message.builder().setToken(token)
				.putData("notificationIdx", String.valueOf(fcmEventDto.getNotificationIdx()))
				.putData("eventType", fcmEventDto.getEventType())
				.putData("notificationType", fcmEventDto.getNotificationType()).putData("title", fcmEventDto.getTitle())
				.putData("content", fcmEventDto.getContent()).putData("sendUsername", fcmEventDto.getSendUsername())
				.putData("recvUsername", fcmEventDto.getRecvUsername())
				.putData("reviewType", fcmEventDto.getReviewType())
				.putData("targetId", String.valueOf(fcmEventDto.getTargetId())).build();

		firebaseMessaging.send(message);
	}

}
