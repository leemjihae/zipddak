package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewExpertDto {
    private Integer reviewExpertIdx;
    private Integer score;
    private String content;
    private Date createdate;
    private String writer;
    private Integer expertIdx;
    private Integer matchingIdx;
    private Integer img1;
    private Integer img2;
    private Integer img3;
}
