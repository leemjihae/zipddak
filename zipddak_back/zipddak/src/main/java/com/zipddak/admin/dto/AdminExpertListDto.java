package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminExpertListDto {

	private Integer expertIdx; // 전문가idx
	private String name; //회원명
	private String activityName; //활동명
	private String username; //아이디
	private long reportCount; // 신고수
	private String cateName; // 카테고리
	private String phone; // 휴대전화
	private Date createdAt; // 가입일
	private String state; // 활동상태
	
}
