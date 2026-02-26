package com.zipddak.entity;

import java.sql.Date;
import java.time.LocalDateTime;

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

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.OrderItemDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderItemIdx;

	@Column(nullable = false)
	private Integer orderIdx;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "productIdx")
	private Product product;

	@Column
	private Integer productOptionIdx;

	@Column(nullable = false)
	private Long unitPrice;

	@Column(nullable = false)
	private Integer quantity;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ReceiveWay receiveWay; // POST, PICKUP

	@Column
	private String postComp;

	@Column
	private String trackingNo;
	
	@Column
	private LocalDateTime firstShipDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OrderStatus orderStatus;

	@Column
	private Integer refundIdx;

	@Column
	private Integer exchangeIdx;

	@Column
	private Integer exchangeNewOptIdx;
	
	@Column
	private Integer cancelIdx;
	
	@CreationTimestamp
	private Date createdAt;
	
	@Column
    private LocalDateTime deliveredAt; //배송완료 날짜 
	
	@Column
	private LocalDateTime exchangeRejectedAt;  //교환 거절일자 (판매자)
	
	@Column
	private LocalDateTime exchangeAcceptedAt;	//교환 접수수락일자 (판매자) = 수거요청일자
	
	@Column
	private LocalDateTime exchangePickupComplatedAt; //교환 수거완료일자 (판매자)
	
	@Column
	private LocalDateTime resendAt; //교환 재배송 일자 (판매자)
	
	@Column
	private LocalDateTime exchangeComplatedAt;  //교환 처리완료 일자 
	
	@Column
	private LocalDateTime refundRejectedAt;  //반품 거절일자 (판매자)
	
	@Column
	private LocalDateTime refundAcceptedAt;	//반품 접수수락일자 (판매자) = 수거요청일자
	
	@Column
	private LocalDateTime refundPickupComplatedAt; //반품 수거완료일자 (판매자)
	
	@Column
	private LocalDateTime refundComplatedAt;  //반품 처리완료 일자 
	

	public enum ReceiveWay {
		post, pickup
	}

	public enum OrderStatus {
		상품준비중, 배송중, 배송완료, 취소완료, 교환요청, 교환회수, 교환발송, 교환완료, 교환거절, 반품요청, 반품회수, 반품완료, 반품거절, 결제취소
	}

	public OrderItemDto toDto() {
		return OrderItemDto.builder().orderItemIdx(orderItemIdx).orderIdx(orderIdx).productOptionIdx(productOptionIdx)
				.unitPrice(unitPrice).quantity(quantity).receiveWay(receiveWay.toString()).postComp(postComp)
				.trackingNo(trackingNo).orderStatus(orderStatus.toString()).refundIdx(refundIdx)
				.exchangeIdx(exchangeIdx).exchangeNewOptIdx(exchangeNewOptIdx).createdAt(createdAt)
				.productIdx(product.getProductIdx()).name(product.getName()).sellerUsername(product.getSellerUsername())
				.build();
	}
	
	//자동 배송완료처리 메소드 
	public void completeDelivery() {
        if (this.orderStatus != OrderStatus.배송중) {
            throw new IllegalStateException("배송중 상태에서만 배송완료 가능");
        }

        this.orderStatus = OrderStatus.배송완료;
        this.deliveredAt = LocalDateTime.now();
    }
}
