package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityDto {
    private Integer communityIdx;
    private Integer category;
    private String title;
    private String content;
    private Date createdate;
    private Integer views;
    private Integer img1;
    private Integer img2;
    private Integer img3;
    private Integer img4;
    private Integer img5;
    
    private String username;
    private String nickname;
}
