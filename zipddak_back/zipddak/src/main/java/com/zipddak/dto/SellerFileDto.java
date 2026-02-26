package com.zipddak.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerFileDto {
	
	private Integer expertFileIdx;
    private String fileName;
    private String fileRename;
    private String storagePath;
    private Date createdAt;
}
