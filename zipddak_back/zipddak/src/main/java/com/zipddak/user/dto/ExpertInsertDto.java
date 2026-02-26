package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.entity.Expert;
import com.zipddak.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertInsertDto {
	
    private String username;
    private String activityName;
    private String zonecode;
    private String addr1;
    private String addr2;
    private Integer employeeCount;
    private String providedServiceIdx;
    private String businessLicense;
    private Integer businessLicensePdfId;
    private String settleBank;
    private String settleAccount;
    private String settleHost;
    private Date createdAt;
    
    public Expert toEntity() {
    	return Expert.builder()
    			.user(User.builder().username(username).build())
    			.activityName(activityName)
    			.zonecode(zonecode)
    			.addr1(addr1)
    			.addr2(addr2)
    			.employeeCount(employeeCount)
    			.providedServiceIdx(providedServiceIdx)
    			.businessLicense(businessLicense)
    			.businessLicensePdfId(businessLicensePdfId)
    			.settleBank(settleBank)
    			.settleAccount(settleAccount)
    			.settleHost(settleHost)
    			.build();
    }

}
