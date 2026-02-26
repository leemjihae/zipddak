package com.zipddak.dto;

import java.sql.Date;
import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertDto {

    private Integer expertIdx;
    private String username;
    private String activityName;
    private Integer profileImageIdx;
    private String introduction;
    private Integer mainServiceIdx;
    private String zonecode;
    private String addr1;
    private String addr2;
    private Integer employeeCount;
    private Time contactStartTime;
    private Time contactEndTime;
    private String externalLink1;
    private String externalLink2;
    private String externalLink3;
    private String providedServiceIdx;
    private String providedServiceDesc;
    private Integer certImage1Id;
    private Integer certImage2Id;
    private Integer certImage3Id;
    private Integer businessLicensePdfId;
    private String questionAnswer1;
    private String questionAnswer2;
    private String questionAnswer3;
    private String settleBank;
    private String settleAccount;
    private String settleHost;
    private Date createdAt;
    private String activityStatus;
}
