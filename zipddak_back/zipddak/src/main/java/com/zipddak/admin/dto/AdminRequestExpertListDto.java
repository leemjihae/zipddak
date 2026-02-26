package com.zipddak.admin.dto;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestExpertListDto {

	private String username;
	private String name;
	private String phone;
	private String businessLicense;
	private String mainService;
	private Integer employeeCount;
	private Date createdAt;
	private Integer expertIdx;
	private String activityStatus;
	
}
