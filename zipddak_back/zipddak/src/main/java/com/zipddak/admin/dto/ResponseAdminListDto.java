package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.util.PageInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseAdminListDto {

	private List<?> list;
	private PageInfo pageInfo;
	
}
