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
public class ReviewProduct {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer reviewProductIdx;

	@Column(nullable = false)
	private Integer score;

	@Column(columnDefinition = "TEXT")
	private String content;

	@CreationTimestamp
	private Date createdate;

	@Column
	private String writer;

	@Column
	private Integer productIdx;

	@Column
	private Integer orderItemIdx;

	@Column
	private Integer img1;

	@Column
	private Integer img2;

	@Column
	private Integer img3;
}
