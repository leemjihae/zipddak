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
public class ExchangeDto {

    private Integer exchangeIdx;
    private Integer orderIdx;
    private String reasonType;
    private String reasonDetail;
    private Integer image1Idx;
    private Integer image2Idx;
    private Integer image3Idx;
    private String shippingChargeType;
    private Integer roundShippingFee;
    private String reshipName;
    private String reshipPhone;
    private String reshipZipcode;
    private String reshipAddr1;
    private String reshipAddr2;
    private String reshipPostMemo;
    private String pickupPostComp;
    private String pickupTrackingNo;
    private String reshipPostComp;
    private String reshipTrackingNo;
    private Date createdAt;
}
