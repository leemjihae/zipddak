package com.zipddak.entity;

import java.sql.Timestamp;

import javax.persistence.*;

import org.hibernate.annotations.DynamicInsert;

import com.zipddak.entity.Order.PaymentStatus;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentIdx;

    @Column(nullable = false)
    private String paymentKey;

    @Column
    private String type;

    @Column(nullable = false)
    private String orderId;

    @Column
    private String orderName;

    @Column(nullable = false)
    private String mId;

    @Column
    private String method;

    @Column(nullable = false)
    private Integer totalAmount;

    @Column
    private Integer balanceAmount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Timestamp requestedAt;

    @Column
    private Timestamp approvedAt;

    @Column
    private String lastTransactionKey;

    @Column
    private Boolean isPartialCancelable;

    @Column
    private String receiptUrl;

    @Column
    private Integer cardAmount;

    @Column
    private String cardIssuerCode;

    @Column
    private String cardAcquirerCode;

    @Column
    private String cardNumber;

    @Column
    private Integer cardInstallmentPlanMonths;

    @Column
    private String easypayProvider;

    @Column
    private Integer easypayAmount;
    
	@Enumerated(EnumType.STRING)
	@Column
	private PaymentType paymentType;
	
	public enum PaymentType {
		RENTAL, MATCHING, ORDER, MEMBERSHIP
	}
	
	@Column
	private String username;

	@Column
	private String sellUsername;
	
	@Column
	private String sellUserType;
	
}
