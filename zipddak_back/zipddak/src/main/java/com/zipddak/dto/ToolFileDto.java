package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToolFileDto {
    private Integer toolFileIdx;
    private String fileName;
    private String fileRename;
    private String storagePath;
    private Date createdAt;
}
