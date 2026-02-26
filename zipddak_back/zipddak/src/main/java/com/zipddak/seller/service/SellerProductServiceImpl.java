package com.zipddak.seller.service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.dto.CategoryDto;
import com.zipddak.dto.ProductDto;
import com.zipddak.dto.ProductOptionDto;
import com.zipddak.entity.Category;
import com.zipddak.entity.Product;
import com.zipddak.entity.ProductOption;
import com.zipddak.repository.CategoryRepository;
import com.zipddak.repository.ProductOptionRepository;
import com.zipddak.repository.ProductRepository;
import com.zipddak.seller.dto.CategoryResponseDto;
import com.zipddak.seller.dto.OptionGroupDto;
import com.zipddak.seller.dto.OptionValueDto;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.dto.SubCategoryResponseDto;
import com.zipddak.seller.exception.NotFoundException;
import com.zipddak.seller.repository.SellerProductRepository;
import com.zipddak.util.FileSaveService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerProductServiceImpl implements SellerProductService {

	private final CategoryRepository category_repo;
	private final ProductRepository product_repo;
	private final ProductOptionRepository productOpt_repo;
	private final SellerProductRepository sellerProduct_repo;
	private final ModelMapper model_mapper;

	@Autowired
	private FileSaveService fileSave_svc;

	// 첨부파일 저장 경로
	@Value("${productFile.path}")
	private String productFileUploadPath;

	// 카테고리 리스트 조회
	@Override
	public List<CategoryResponseDto> getCategoryTree() {

		Category.CategoryType type = Category.CategoryType.product;

		return category_repo.findByDepthAndType(1, type).stream().map(ct -> {
			List<SubCategoryResponseDto> subList = category_repo.findByParentIdxAndType(ct.getCategoryIdx(), type)
					.stream().map(c -> new SubCategoryResponseDto(c.getCategoryIdx(), c.getName()))
					.collect(Collectors.toList());

			return new CategoryResponseDto(ct.getCategoryIdx(), ct.getName(), subList);
		}).collect(Collectors.toList());
	}

	// 상품 등록
	@Override
	@Transactional
	public SaveResultDto productRegist(ProductDto product_dto, MultipartFile thumbnail, MultipartFile[] addImageFiles,
			MultipartFile[] detailImageFiles, String optionsJson) throws Exception {
		// 썸네일 파일 저장
		Integer thumbnailIdx = fileSave_svc.uploadFile(thumbnail, productFileUploadPath, "product");

		// 추가이미지 첨부를 한 경우
		// 추가이미지 파일 저장
		Integer[] imageIdxArr = new Integer[5];
		if (addImageFiles != null) {
			int idx = 0;
			for (MultipartFile f : addImageFiles) {
				if (!f.isEmpty() && idx < 5) {
					imageIdxArr[idx] = fileSave_svc.uploadFile(f, productFileUploadPath, "product");
					idx++;
				}
			}
		}

		// 상세이미지 파일 저장
		Integer[] detailIdxArr = new Integer[2];
		if (detailImageFiles != null) {
			int idx = 0;
			for (MultipartFile f : detailImageFiles) {
				if (!f.isEmpty() && idx < 2) {
					detailIdxArr[idx] = fileSave_svc.uploadFile(f, productFileUploadPath, "product");
					idx++;
				}
			}
		}

		Product productEntity = model_mapper.map(product_dto, Product.class); // dto를 entity로 변환

		// thumbnail 파일 세팅
		productEntity.setThumbnailFileIdx(thumbnailIdx);

		// 추가이미지 image1~image5 자동 매핑
		setFileIdx(productEntity, "Image", imageIdxArr);

		// 상세이미지 detail1~detail2 자동 매핑
		setFileIdx(productEntity, "Detail", detailIdxArr);
		
		productEntity.setDeletedYn(false);
		
		// db저장
		product_repo.save(productEntity);

		// 옵션 세팅
		ObjectMapper mapper = new ObjectMapper();
		if (product_dto.getOptionYn() != null && product_dto.getOptionYn() && optionsJson != null) {
			List<OptionGroupDto> optionGroups = mapper.readValue(optionsJson,
					new TypeReference<List<OptionGroupDto>>() {
					});

			for (OptionGroupDto optGroup : optionGroups) {
				for (OptionValueDto optValue : optGroup.getValues()) {

					ProductOption pdOption = ProductOption.builder().product(productEntity)
							.name(optGroup.getOptionName()) // 색상, 사이즈 등
							.value(optValue.getValue()) // 빨강, 파랑...
							.price(optValue.getPrice()) // 옵션 가격
							.build();
					productOpt_repo.save(pdOption);
				}
			}
		}
		
		return new SaveResultDto(true, productEntity.getProductIdx(), "상품 등록이 완료되었습니다.");
	}

	// 셀러가 등록한 상품의 카테고리만 조회
	@Override
	public List<CategoryDto> getSellerCategories(String sellerUsername){
		return sellerProduct_repo.findSellerCategories(sellerUsername);
	}

	// 특정 셀러의 상품 리스트
	public Map<String, Object> searchMyProductList(String sellerUsername, String status, String category, String keyword, Integer page) {
        PageRequest pr = PageRequest.of(page - 1, 10);
        
        // -> status 문자열을 Boolean 리스트로 변환 
        List<Boolean> visibleList = null;
        if (status != null && !status.isEmpty()) {
            visibleList = Arrays.stream(status.split(","))
                    .map(s -> {
                        s = s.trim();
                        if (s.equals("1")) return true;
                        if (s.equals("0")) return false;
                        // fallback: "true"/"false" 같은 문자열을 파싱
                        return Boolean.parseBoolean(s);
                    })
                    .collect(Collectors.toList());
        }

        // 카테고리 (int 리스트)
        List<Integer> categoryList = category != null && !category.isEmpty()
                ? Arrays.stream(category.split(",")).map(Integer::parseInt).collect(Collectors.toList())
                : null;

        SearchConditionDto scDto = SearchConditionDto.builder()
						                .sellerUsername(sellerUsername)
						                .visibleList(visibleList)
						                .categoryList(categoryList)
						                .keyword(keyword)
						                .build();

        List<ProductDto> myProductList = sellerProduct_repo.searchMyProducts(pr, scDto, sellerUsername);
        Long myProductCount = sellerProduct_repo.countMyProducts(scDto);

        int allPage = (int) Math.ceil(myProductCount / 10.0);
        int startPage = (page - 1) / 10 * 10 + 1;
        int endPage = Math.min(startPage + 9, allPage);

        Map<String, Object> result = new HashMap<>();
        result.put("curPage", page);
        result.put("allPage", allPage);
        result.put("startPage", startPage);
        result.put("endPage", endPage);
        result.put("myProductList", myProductList);
        result.put("myProductCount", myProductCount);

        return result;
    }
	
	//상품 디테일 보기 
	@Override
	public ProductDto MyProductDetail(String sellerUsername, Integer productIdx) {
//		Product productEntity = product_repo.findByProductIdxAndSellerUsername(productIdx, sellerUsername)
//			    									.orElseThrow(() -> new IllegalStateException("상품 정보 없음 또는 권한 없음"));
		//상품 정보(옵션 제외)
		ProductDto ProductDto = sellerProduct_repo.findByProductIdxAndSellerId(sellerUsername,productIdx);
		if (ProductDto == null) {
			throw new NotFoundException("상품 정보 없음 또는 권한 없음");
	    }
		//위 상품의 옵션 리스트 
		if (ProductDto.getOptionYn()) {
		    List<ProductOptionDto> pdOptions = sellerProduct_repo.findByProductOptions(productIdx);

		    if (pdOptions == null || pdOptions.isEmpty()) {
		        throw new IllegalStateException("옵션 상품인데 옵션 데이터가 없음");
		    }
		    ProductDto.setPdOptions(pdOptions);
		    
		}else {
		    ProductDto.setPdOptions(Collections.emptyList());
		}
		
		return ProductDto;
		
	}
	
	//상품 수정 
	@Override
	@Transactional
	public SaveResultDto productModify(ProductDto product_dto, String sellerUsername, Integer productIdx,
										MultipartFile thumbnail, MultipartFile[] addImageFiles, MultipartFile[] detailImageFiles,
										Integer deleteThumbIdx, Integer[] deleteAddIdxList, Integer[] deleteDetailIdxList, String optionsJson) throws Exception {

		//기존 상품 조회
		Product productEntity = product_repo.findByProductIdxAndSellerUsername(productIdx, sellerUsername).orElseThrow(() -> new Exception("상품 없음 또는 권한 없음"));
		
	    // 썸네일 처리 (새 파일 없으면 기존 유지 (아무것도 안 함))
	    if (thumbnail != null && !thumbnail.isEmpty()) {
	        // 기존 썸네일 삭제 (실제경로 + DB) 
	        if (deleteThumbIdx != null) {
	            fileSave_svc.deleteRealFile(deleteThumbIdx, productFileUploadPath, "product");
	        }

	        // 새 썸네일 저장
	        Integer newThumbIdx = fileSave_svc.uploadFile(thumbnail, productFileUploadPath, "product");
	        productEntity.setThumbnailFileIdx(newThumbIdx);
	    }

	    // 추가 이미지 처리 (최대 5)
	    // 1. 기존 이미지 수집
	    List<Integer> addIdxList = new ArrayList<>();
	    addIfNotNull(addIdxList, productEntity.getImage1FileIdx());
	    addIfNotNull(addIdxList, productEntity.getImage2FileIdx());
	    addIfNotNull(addIdxList, productEntity.getImage3FileIdx());
	    addIfNotNull(addIdxList, productEntity.getImage4FileIdx());
	    addIfNotNull(addIdxList, productEntity.getImage5FileIdx());

	    // 2. 삭제 요청 반영 + 실제 파일 삭제
	    if (deleteAddIdxList != null) {
	        for (Integer idx : deleteAddIdxList) {
	            fileSave_svc.deleteRealFile(idx, productFileUploadPath, "product");
	            addIdxList.remove(idx);
	        }
	    }

	    // 3. 최종 추가 이미지 목록 구성
	    if (addImageFiles != null) {
	        for (MultipartFile f : addImageFiles) {
	            if (!f.isEmpty() && addIdxList.size() < 5) {
	                addIdxList.add(
	                        fileSave_svc.uploadFile(f, productFileUploadPath, "product")
	                );
	            }
	        }
	    }
	    setAddImageIdx(productEntity, addIdxList);
	    

	    // 상세 이미지 처리 (최대 2)
	    List<Integer> detailIdxList = new ArrayList<>();
	    addIfNotNull(detailIdxList, productEntity.getDetail1FileIdx());
	    addIfNotNull(detailIdxList, productEntity.getDetail2FileIdx());

	    if (deleteDetailIdxList != null) {
	        for (Integer idx : deleteDetailIdxList) {
	            fileSave_svc.deleteRealFile(idx, productFileUploadPath, "product");
	            detailIdxList.remove(idx);
	        }
	    }
	    if (detailImageFiles != null) {
	        for (MultipartFile f : detailImageFiles) {
	            if (!f.isEmpty() && detailIdxList.size() < 2) {
	                detailIdxList.add(
	                        fileSave_svc.uploadFile(f, productFileUploadPath, "product")
	                );
	            }
	        }
	    }
	    setDetailImageIdx(productEntity, detailIdxList);
		
		
	    // 옵션 처리 (전부 갈아끼우기)
	    productOpt_repo.deleteByProduct(productEntity);

	    if (Boolean.TRUE.equals(product_dto.getOptionYn()) && optionsJson != null) {

	        ObjectMapper mapper = new ObjectMapper();
	        List<OptionGroupDto> optionGroups = mapper.readValue(optionsJson, new TypeReference<>() {});

	        for (OptionGroupDto group : optionGroups) {
	            for (OptionValueDto value : group.getValues()) {

	                productOpt_repo.save(
	                        ProductOption.builder()
	                                .product(productEntity)
	                                .name(group.getOptionName())
	                                .value(value.getValue())
	                                .price(value.getPrice())
	                                .build()
	                );
	            }
	        }
	    }
		
	    // 나머지 상품 정보 업데이트
	    productEntity.updateFromDto(product_dto);
	    product_repo.save(productEntity);

	    return new SaveResultDto(true, null, "상품 수정이 완료되었습니다.");
	}
	
	//상품 삭제 
	@Override
	@Transactional
	public SaveResultDto productDelete(ProductDto product_dto, String sellerUsername, Integer productIdx)throws Exception {
		//상품 조회 
		Product productEntity = product_repo.findByProductIdxAndSellerUsername(productIdx, sellerUsername).orElseThrow(() -> new Exception("상품 없음 또는 권한 없음"));
		
		//삭제처리 ( deletedYn = true)
		productEntity.setVisibleYn(false);	//판매중 -> 비공개 전환 (마켓 상품리스트 노출 방지) 
		productEntity.delete();
		
		//상품에 등록된 이미지는 지금 삭제 안함 
//		deleteProductImages(productEntity);
		
		return new SaveResultDto(true, null, "상품 삭제가 완료되었습니다.");
	}
	

	// 엔터티 파일컬럼에 자동 매핑 메소드
	private void setFileIdx(Object entity, String prefix, Integer[] fileIdxArr) {
		try {
			for (int i = 0; i < fileIdxArr.length; i++) {
				if (fileIdxArr[i] == null)
					continue;

				String methodName = "set" + prefix + (i + 1) + "FileIdx";
				Method method = entity.getClass().getMethod(methodName, Integer.class);

				method.invoke(entity, fileIdxArr[i]);
			}

		} catch (Exception e) {
			throw new RuntimeException("파일 인덱스 매핑 실패: " + e.getMessage());
		}
	}

	//상품 수정,삭제시 이미지 처리 메소드 
	private void addIfNotNull(List<Integer> list, Integer value) {
	    if (value != null) list.add(value);
	}
	private void setAddImageIdx(Product p, List<Integer> list) {
	    p.setImage1FileIdx(list.size() > 0 ? list.get(0) : null);
	    p.setImage2FileIdx(list.size() > 1 ? list.get(1) : null);
	    p.setImage3FileIdx(list.size() > 2 ? list.get(2) : null);
	    p.setImage4FileIdx(list.size() > 3 ? list.get(3) : null);
	    p.setImage5FileIdx(list.size() > 4 ? list.get(4) : null);
	}
	private void setDetailImageIdx(Product p, List<Integer> list) {
	    p.setDetail1FileIdx(list.size() > 0 ? list.get(0) : null);
	    p.setDetail2FileIdx(list.size() > 1 ? list.get(1) : null);
	}

	//상품삭제시 이미지 처리 메소드 
	@Override
    public void deleteProductImages(Product productEntity) {
        // 현재는 정책상 이미지 물리 삭제 안 함
        // 추후 배치/정책 도입 시 구현 예정
		try {
			List<Integer> imgFileIdxList = new ArrayList<>(); 
			addIfNotNull(imgFileIdxList, productEntity.getThumbnailFileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getImage1FileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getImage2FileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getImage3FileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getImage4FileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getImage5FileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getDetail1FileIdx()); 
			addIfNotNull(imgFileIdxList, productEntity.getDetail2FileIdx());
			
			// 상품에 등록된 이미지 삭제 
			if (imgFileIdxList != null) { 
				for (Integer idx : imgFileIdxList) { 
					fileSave_svc.deleteRealFile(idx, productFileUploadPath, "product");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}
	


}
