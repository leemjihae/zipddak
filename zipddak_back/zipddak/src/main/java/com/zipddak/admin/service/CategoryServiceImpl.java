package com.zipddak.admin.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.zipddak.dto.CategoryDto;
import com.zipddak.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;
	
	// 1,2,4,5 의 형식으로 들어온 카테고리
	@Override
	public List<CategoryDto> providedService(String providedServiceIdxs) throws Exception {
		
		List<CategoryDto> categoryList = new ArrayList<CategoryDto>();
		
		int[] cateArr = Arrays.stream(providedServiceIdxs.split(","))
							.mapToInt(Integer::parseInt)
							.toArray();
	
		for(int cate : cateArr) {
			categoryList.add(categoryRepository.findById(cate).orElseThrow(() -> new Exception("카테고리 불러오는 중 에러")).toDto());
		}
		
		return categoryList;
	}

	

}
