package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.zipddak.entity.Category;
import com.zipddak.entity.Category.CategoryType;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
	
	// 상위 카테고리 (depth = 1)
	// select * from category where depth = ㅇㅇ and type = ㅁㅁ
    List<Category> findByDepthAndType(int depth, Category.CategoryType type);
    
    // 특정 상위 카테고리의 하위 카테고리
    // select * from category where parentIdx = ㅇㅇ and type = ㅁㅁ
    List<Category> findByParentIdxAndType(Integer parentIdx, Category.CategoryType type);

  	List<Category> findByParentIdx(Integer parentIdx);
	
	@Query("SELECT c.categoryIdx FROM Category c WHERE c.name = :name")
	Integer findCategoryIdxByName(@Param("name") String name);
	
	Category findByName(String name);

}
