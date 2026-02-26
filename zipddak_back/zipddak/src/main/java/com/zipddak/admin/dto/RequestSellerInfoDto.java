package com.zipddak.admin.dto;

import lombok.Data;

import java.util.List;

import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestSellerInfoDto {

	private String compName;
	private String brandName;
	private String ceoName;
	private String phone;
	private String businessLicense;
	private String account;
	private String bank;
	private String host;
	
	private String itemIdxs;
	private List<String> items;
	
}
