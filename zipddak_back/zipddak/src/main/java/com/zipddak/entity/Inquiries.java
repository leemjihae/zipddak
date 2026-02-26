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
public class Inquiries {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer inquiryIdx;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private InquiryType type;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	@Column(nullable = false)
	private String writerUsername;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private WriterType writerType;

	@Column
	private String answererUsername;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AnswererType answererType;

	@Column(columnDefinition = "TEXT")
	private String answer;

	@Column
	private Integer image1Idx;

	@Column
	private Integer image2Idx;

	@Column
	private Integer image3Idx;

	@Column
	private Integer orderItemIdx;

	@Column
	private Integer productIdx;

	@CreationTimestamp
	private Date writeAt;

	private Date answerAt;

	public enum InquiryType {
		PAYMENT, SHIPPING, ORDER_ISSUE, RENTAL, EXPERT_MATCHING, USER_MATCHING, ACCOUNT, SETTLEMENT, SUGGESTION,
		MEMBERSHIP, SYSTEM, PRODUCT, ETC
	}

	public enum WriterType {
		USER, EXPERT, SELLER
	}

	public enum AnswererType {
		SELLER, ADMIN
	}
}
