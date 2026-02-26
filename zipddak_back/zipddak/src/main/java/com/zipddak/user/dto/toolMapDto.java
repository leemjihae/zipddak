package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.entity.Tool.ToolStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class toolMapDto {
	
	private Double lat;
	private Double lng;
	private String address;

}
