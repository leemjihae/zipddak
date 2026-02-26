package com.zipddak.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowToolDto {

	private String toolImg;
	private String toolName;
	private String addr1;
	private String addr2;
	private String ownerName;
	private String ownerPhone;
	private Long oneDayAmount;
	
}
