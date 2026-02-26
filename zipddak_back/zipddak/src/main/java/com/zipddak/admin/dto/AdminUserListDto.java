package com.zipddak.admin.dto;

import java.sql.Date;

import com.zipddak.entity.User.UserState;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserListDto {
	
	private String name;
	private String nickname;
	private String username;
	private String phone;
	private Date createdAt;
	private UserState state;
	
}
