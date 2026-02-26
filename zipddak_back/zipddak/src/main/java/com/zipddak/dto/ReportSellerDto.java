package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportSellerDto {
    private Integer reportIdx;
    private Date reportedAt;
    private String reason;
    private String state;
    private String userUsername;
    private String sellerUsername;
}
