package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOptionDto {
    private Integer productOptionIdx;
    private String name;
    private String value;
    private Long price;
    private Date createdAt;
    private Date updatedAt;
    
    private Integer productIdx;
    private String productName;
}
