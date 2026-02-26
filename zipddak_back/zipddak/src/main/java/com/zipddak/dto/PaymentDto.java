package com.zipddak.dto;

import java.sql.Date;

import com.zipddak.entity.Payment.PaymentType;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Integer paymentIdx;
    private String paymentKey;
    private String type;
    private String orderId;
    private String orderName;
    private String mId;
    private String method;
    private Integer totalAmount;
    private Integer balanceAmount;
    private String status;
    private Date requestedAt;
    private Date approvedAt;
    private String lastTransactionKey;
    private Boolean isPartialCancelable;
    private String receiptUrl;
    private Integer cardAmount;
    private String cardIssuerCode;
    private String cardAcquirerCode;
    private String cardNumber;
    private Integer cardInstallmentPlanMonths;
    private String easypayProvider;
    private Integer easypayAmount;
    private PaymentType paymentType;
    private String username;
}
