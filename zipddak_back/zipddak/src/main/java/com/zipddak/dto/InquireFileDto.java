package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquireFileDto {
    private Integer inquireFileIdx;
    private String fileName;
    private String fileRename;
    private String storagePath;
    private Date createdAt;
}
