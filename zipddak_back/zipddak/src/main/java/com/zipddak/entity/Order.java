package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.OrderDto;

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
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderIdx;

	@Column(nullable = false, unique = true)
	private String orderCode;

	@Column(nullable = false)
	private Long subtotalAmount;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "userUsername")
	private User user;

	@Column(nullable = false)
	private Long shippingAmount;

	@Column(nullable = false)
	private Long totalAmount;

	@Column
	private Integer paymentIdx;

	@Column
	private String postZonecode;

	@Column
	private String postAddr1;

	@Column
	private String postAddr2;

	@Column(nullable = false)
	private String phone;

	@Column(nullable = false)
	private String postRecipient;

	@Column(columnDefinition = "TEXT")
	private String postNote;

	@CreationTimestamp
	private Date createdAt;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentStatus paymentStatus;
	
	public enum PaymentStatus {
		결제완료, 결제취소, 부분취소, 결제대기
	}

	public OrderDto toDto() {
		return OrderDto.builder()
						.orderIdx(orderIdx)
						.orderCode(orderCode)
						.subtotalAmount(subtotalAmount)
						.shippingAmount(shippingAmount)
						.totalAmount(totalAmount)
						.paymentIdx(paymentIdx)
						.postZonecode(postZonecode)
						.postAddr1(postAddr1)
						.postAddr2(postAddr2)
						.phone(phone)
						.postRecipient(postRecipient)
						.postNote(postNote)
						.createdAt(createdAt)
						.username(user.getUsername())
						.name(user.getName())
						.build();
	}

}
