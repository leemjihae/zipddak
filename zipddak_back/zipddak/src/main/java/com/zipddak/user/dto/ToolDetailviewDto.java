package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.entity.Tool.ToolStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToolDetailviewDto {
	
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
    
    //이미지
    private String thunbnail;
    private String img0;
    private String img1;
    private String img2;
    private String img3;
    private String img4;
    
    private Integer toolChatCnt; 
    
    private String settleBank;
    private String settleAccount;
    private String settleHost;
	
	 private Boolean favorite; // 관심 표시
	 private Long favoriteCount; //관심 수
	 private Long rentalCount;
	 
	 private String categoryName;
	private String nickname;
	private String ownerProfile;
	private String ownerAddr;
	
	private String tradeAddr1;
    private String tradeAddr2;
    private String tradeZonecode;

}
