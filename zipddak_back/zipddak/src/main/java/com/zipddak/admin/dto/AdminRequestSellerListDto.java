package com.zipddak.admin.dto;


import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestSellerListDto {

	private Integer sellerIdx;
	private String compName;
	private String brandName;
	private String ceoName;
	private String managerTel;
	private String compBno;
	private String compHp;
	private String activityStatus;
	private Date createdAt;
	
}
