package com.zipddak.admin.dto;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestExpertInfoDto {

	private String name;
	private String activityName;
	private Integer employeeCount;
	private String businessLicense;
	private String businessPdfFile;
	private String fileStoragePath;
	private String bank;
	private String account;
	private String host;
	
	private String serviceString;
	private List<String> service;
	
}
