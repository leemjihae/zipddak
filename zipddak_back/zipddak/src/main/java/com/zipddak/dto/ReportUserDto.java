package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportUserDto {
    private Integer reportIdx;
    private Date reportedAt;
    private String reason;
    private String state;
    private String userUsername;
    private String targetUsername;
}
