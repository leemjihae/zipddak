package com.zipddak.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class MessageRoom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer messageRoomIdx;

	@Column
	private String type; // TOOL, EXPERT
	
    @Column
    private Integer toolIdx;

    @Column
    private Integer estimateIdx;

	@Column(nullable = false)
	private String recvUsername;

	@Column(nullable = false)
	private String sendUsername;
	
	@Column(columnDefinition = "TEXT")
	private String lastMessage;
	
	@Column
	private String lastSender;
	
	@CreationTimestamp
	private Timestamp createdAt;
	
	@UpdateTimestamp
	private Timestamp updatedAt;
}
