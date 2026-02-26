package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSellerListDto {

	private Integer sellerIdx; //판매업체 id
	private String compName; // 회사 이름
	private String brandName; // 브랜드 명
	private String username; // 아이디
	private String ceoName; // 사장 이름
	private long reportCount; // 신고 수
	private String managerTel; // 연락 가능 번호
	private Date createdAt; // 등록일
	private String state; // 활동 상태
	
}
