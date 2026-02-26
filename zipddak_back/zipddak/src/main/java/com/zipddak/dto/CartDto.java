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
public class CartDto {
    private Integer cartIdx;
    private String userUsername;
    private Integer optionIdx;
    private Integer quantity;
    private Date createdAt;
    private Integer productIdx;
    private String productName;
    private Integer thumbnailFileIdx;
}
