package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {

	Long countByMessageRoomIdxAndRecvUsernameAndConfirmFalse(Integer messageRoomIdx, String username);

	List<Message> findByMessageRoomIdxOrderByCreatedAtAsc(Integer messageRoomIdx);

	List<Message> findByMessageRoomIdxAndRecvUsernameAndConfirmFalse(Integer messageRoomIdx, String recvUsername);
}
