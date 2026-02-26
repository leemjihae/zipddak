package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportReviewDto {
    private Integer reportIdx;
    private Date reportedAt;
    private String reason;
    private String state;
    private String userUsername;
    private Integer reviewIdx;
    private String reviewTarget;
}
