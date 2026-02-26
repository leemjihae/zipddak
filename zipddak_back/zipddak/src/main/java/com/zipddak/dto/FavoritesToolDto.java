package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoritesToolDto {
    private Integer favoriteIdx;
    private String userUsername;
    private Integer toolIdx;
    private Date createdAt;
}
