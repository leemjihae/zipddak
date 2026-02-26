package com.zipddak.admin.dto;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminMembershipListDto {

	private Integer membershipIdx;// 멤버십 번호
	private String username; // 전문가 아이디
	private String activityName; // 활동명
	private Timestamp paymentDate; //결제일
	private Date startDate; // 시작일
	private Date endDate; // 만료일
	
}
