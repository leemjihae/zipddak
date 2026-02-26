package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoritesProductDto {
    private Integer favoriteIdx;
    private String userUsername;
    private Integer productIdx;
    private Date createdAt;
}
