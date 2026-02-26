package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecvUserDto {

	private String sender;
	private String recvier;
	private String tel;
	private String zonecode;
	private String addr1;
	private String detailAddress;
	private String requestContent;
	private boolean defaultAddress;
	
}
