package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoDto {
	
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
    private String profile;

}
