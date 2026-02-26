package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.dto.CategoryDto;

public interface CategoryService {

	List<CategoryDto> providedService(String providedServiceIdxs) throws Exception;

}
