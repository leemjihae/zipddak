package com.zipddak.dto;

import java.sql.Date;

import javax.persistence.Column;

import com.zipddak.entity.Tool.ToolStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToolDto {
    private Integer toolIdx;
    private String name;
    private Integer category;
    private Long rentalPrice;
    private Boolean freeRental;
    private String content;
   
    private Boolean quickRental;
    private Boolean directRental;
    private Boolean postRental;
    private Boolean freePost;
    private Long postCharge;
    private String zonecode;
    private String addr1;
    private String addr2;
    private String postRequest;
    private ToolStatus satus;
    private String owner;
    private Date createdate;
    private Integer thunbnail;
    private Integer img1;
    private Integer img2;
    private Integer img3;
    private Integer img4;
    private Integer img5;
    private Integer toolChatCnt; 
    
    private String settleBank;
    private String settleAccount;
    private String settleHost;
   
    private String tradeAddr1;
    private String tradeAddr2;
    private String tradeZonecode;
}
