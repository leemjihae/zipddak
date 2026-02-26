package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
public class Matching {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer matchingIdx;

	@Column(nullable = false)
	private String matchingCode;

	@Column(nullable = false)
	private String userUsername;

	@Column(nullable = false)
	private Integer expertIdx;

	@Column(nullable = false)
	private Integer requestIdx;

	@Column(nullable = false)
	private Integer estimateIdx;

	@Column
	private Integer paymentIdx;

	@Column(nullable = false)
	private Date workStartDate;

	@Column(nullable = false)
	private Date workEndDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MatchingStatus status;

	@CreationTimestamp
	private Date createdAt;

	public enum MatchingStatus {
		PAYMENT_CANCELLED, PAYMENT_COMPLETED, IN_PROGRESS, COMPLETED, CANCELLED
	}
}
