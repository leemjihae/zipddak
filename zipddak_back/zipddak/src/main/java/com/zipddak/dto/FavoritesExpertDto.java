package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoritesExpertDto {
    private Integer favoriteIdx;
    private String userUsername;
    private Integer expertIdx;
    private Date createdAt;
}
