package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewToolDto {
    private Integer reviewToolIdx;
    private Integer score;
    private String content;
    private Date createdate;
    private String writer;
    private Integer toolIdx;
    private Integer rentalIdx;
    private Integer img1;
    private Integer img2;
    private Integer img3;
}
