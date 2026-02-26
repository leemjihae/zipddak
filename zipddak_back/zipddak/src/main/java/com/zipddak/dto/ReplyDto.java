package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyDto {
    private Integer replyIdx;
    private String context;
    private String writer;
    private Integer communityIdx;
    private Date createdate;
}
