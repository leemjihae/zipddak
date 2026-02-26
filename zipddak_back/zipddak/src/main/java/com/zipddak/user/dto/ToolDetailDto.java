package com.zipddak.user.dto;

import java.sql.Date;
import java.util.List;

import com.zipddak.entity.Tool;
import com.zipddak.entity.Tool.ToolStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToolDetailDto {
	
	private Integer toolIdx;
    private String name;
    private Integer category;
    private Long rentalPrice;
    private Boolean freeRental;
    private String content;
    private String tradeAddr;
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
    
    private String fileRename; // 썸네일 파일 이름
	 private String storagePath; // 사진 저장 경로
	
	 private Boolean favorite; // 관심 표시
	 private Integer favoriteCount; //관심 수
	 private String categoryName;
	private String nickname;
    
    

}
