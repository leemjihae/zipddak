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
public class Refund {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer refundIdx;

	@Column(nullable = false)
	private Integer orderIdx;

	@Column(nullable = false)
	private String reasonType;

	@Column(columnDefinition = "TEXT")
	private String reasonDetail;

	@Column
	private Integer image1Idx;

	@Column
	private Integer image2Idx;

	@Column
	private Integer image3Idx;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RefundShippingChargeType shippingChargeType; // BUYER, SELLER

	@Column(nullable = false)
	private Integer returnShippingFee;

	@Column(nullable = false)
	private Integer refundAmount;

	@Column
	private String pickupPostComp;

	@Column
	private String pickupTrackingNo;

	@CreationTimestamp
	private Date createdAt;

	public enum RefundShippingChargeType {
		BUYER, SELLER
	}
}