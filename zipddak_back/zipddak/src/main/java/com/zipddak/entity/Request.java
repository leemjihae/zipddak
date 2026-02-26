package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
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
public class Request {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer requestIdx;

	@Column
	private String userUsername;

	@Column
	private Integer largeServiceIdx;

	@Column
	private Integer midServiceIdx;

	@Column
	private Integer smallServiceIdx;

	@Column
	private Integer budget;

	@Column
	private Date preferredDate;

	@Column
	private String location;

	@Column
	private String constructionSize;

	@Column
	private String additionalRequest;

	@Column
	private Integer image1Idx;

	@Column
	private Integer image2Idx;

	@Column
	private Integer image3Idx;

	@CreationTimestamp
	private Date createdAt;

	@Column
	private String purpose;

	@Column
	private String place;

	@Column
	private String status;
	
	@Column
	private Integer expertIdx;

}
