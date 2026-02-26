package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
public class Membership {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer membershipIdx;

	@Column
	private String username;

	@Column
	private Integer paymentIdx;

	@Column
	private Date startDate;
	
	@Column
	private Date endDate;
}
