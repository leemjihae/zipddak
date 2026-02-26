package com.zipddak.dto;

import java.sql.Date;

import javax.persistence.Column;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementDto {
    private Integer settlementIdx;
    private String targetUsername;
    private String targetType;
    private Integer workIdx;
    private String workType;
    private Integer amount;
    private String state;
    private Date completedAt;
    private String comment;
}
