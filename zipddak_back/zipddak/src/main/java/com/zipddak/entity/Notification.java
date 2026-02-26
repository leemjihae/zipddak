package com.zipddak.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

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
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer notificationIdx;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private NotificationType type;
	
	@Column
	private String title;

	@Column(columnDefinition = "TEXT")
	private String content;

	@Column
	private String recvUsername;

	@Column
	private String sendUsername;

	@Column
	private Integer rentalIdx;

	@Column
	private Integer estimateIdx;

	@Column
	private Integer requestIdx;

	@Column
	private String reviewType; // 'TOOL','PRODUCT','EXPERT'

	@Column
	private Integer reviewIdx;

	@Column
	private Integer communityIdx;

	@ColumnDefault("false")
	private Boolean confirm;

	@CreationTimestamp
	private Timestamp createDate;

	public enum NotificationType {
		RENTAL, ESTIMATE, REQUEST, REVIEW, COMMUNITY
	}
}
