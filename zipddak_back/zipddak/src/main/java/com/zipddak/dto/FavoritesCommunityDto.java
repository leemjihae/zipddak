package com.zipddak.dto;

import java.sql.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoritesCommunityDto {
    private Integer favoriteIdx;
    private String userUsername;
    private Integer communityIdx;
    private Date createdAt;
}
