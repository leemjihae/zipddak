package com.zipddak.dto;

import java.sql.Date;

import com.zipddak.entity.User.UserState;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String username;
    private String nickname;
    private String password;
    private String name;
    private String phone;
    private String zonecode;
    private String addr1;
    private String addr2;
    private String settleBank;
    private String settleAccount;
    private String settleHost;
    private String provider;
    private String providerId;
    private String fcmToken;
    private String role;
    private Boolean expert;
    private Date createdate;
    private Integer profileImg;
    private UserState state;
}
