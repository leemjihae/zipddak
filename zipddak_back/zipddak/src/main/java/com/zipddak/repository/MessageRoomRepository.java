package com.zipddak.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zipddak.entity.MessageRoom;

public interface MessageRoomRepository extends JpaRepository<MessageRoom, Integer> {

	List<MessageRoom> findByRecvUsernameOrSendUsernameOrderByUpdatedAtDesc(String recvUsername, String sendUsername);

	
	@Query("SELECT r FROM MessageRoom r " + "WHERE r.type = :type " + "AND ( "
			+ "   (r.sendUsername = :user1 AND r.recvUsername = :user2) " + "   OR "
			+ "   (r.sendUsername = :user2 AND r.recvUsername = :user1) " + ") " + "AND ( "
			+ "   (:toolIdx IS NULL AND r.toolIdx IS NULL OR r.toolIdx = :toolIdx) " + ") " + "AND ( "
			+ "   (:estimateIdx IS NULL AND r.estimateIdx IS NULL OR r.estimateIdx = :estimateIdx) " + ")")
	Optional<MessageRoom> findExistingRoom(@Param("type") String type, @Param("user1") String user1,
			@Param("user2") String user2, @Param("toolIdx") Integer toolIdx, @Param("estimateIdx") Integer estimateIdx);

}
