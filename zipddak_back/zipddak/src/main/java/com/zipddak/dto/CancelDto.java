package com.zipddak.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CancelDto {
	private Integer cancelIdx;
    private Integer paymentIdx;
    private Integer cancelAmount;
    private String cancelReason;
    private Integer refundableAmount;
    private Integer cardDiscountAmount;
    private Integer easyPayDiscountAmount;
    private Date canceledAt;
    private String transactionKey;
    private String cancelStatus;
}
