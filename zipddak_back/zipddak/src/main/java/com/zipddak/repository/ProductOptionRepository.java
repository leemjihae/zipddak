package com.zipddak.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Product;
import com.zipddak.entity.ProductOption;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Integer> {
	List<ProductOption> findByProduct_ProductIdx(Integer productIdx);

	//상품 수정 옵션 처리 (전부 갈아끼우기)
	void deleteByProduct(Product productEntity);
}
