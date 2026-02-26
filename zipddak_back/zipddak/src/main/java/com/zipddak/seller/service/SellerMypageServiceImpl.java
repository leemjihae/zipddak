package com.zipddak.seller.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.SellerDto;
import com.zipddak.entity.Seller;
import com.zipddak.repository.SellerRepository;
import com.zipddak.repository.UserRepository;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.exception.NotFoundException;
import com.zipddak.seller.repository.SellerMypageRepository;
import com.zipddak.util.FileSaveService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerMypageServiceImpl implements SellerMypageService {
	
	private final UserRepository user_repo;
	private final SellerRepository seller_repo;
	private final SellerMypageRepository sellerMypage_repo;
	
	@Autowired
	private FileSaveService fileSave_svc;
	
	// 첨부파일 저장 경로
	@Value("${sellerFile.path}")
	private String sellerFileUploadPath;
	
	
	//프로필 상세보기
	@Override
	public SellerDto getMyProfileDetail(String sellerUsername) {
		//상품 정보(옵션 제외)
		
		SellerDto SellerDto = sellerMypage_repo.findBySellerIdxAndSellerId(sellerUsername);
		System.out.println("SellerDto : " + SellerDto);
		if (SellerDto == null) {
			throw new NotFoundException("판매자 정보 없음 또는 권한 없음");
	    }
		
		return SellerDto;
	}


	//프로필 수정 
	@Override
	public SaveResultDto profileModify(SellerDto seller_dto, String sellerUsername, MultipartFile thumbnail, Integer deleteThumbIdx) throws Exception {
		//기존 유저 조회
//		User userEntity = user_repo.findById(sellerUsername).orElseThrow(() -> new RuntimeException("해당되는 판매자 없음"));
		Seller sellerEntity = seller_repo.findByUser_Username(sellerUsername).orElseThrow(() -> new RuntimeException("해당되는 판매자 없음"));
	    
		// 로고파일 처리 (새 파일 없으면 기존 유지 (아무것도 안 함))
	    if (thumbnail != null && !thumbnail.isEmpty()) {
	        // 기존 로고파일 삭제 (실제경로 + DB) 
	        if (deleteThumbIdx != null) {
	            fileSave_svc.deleteRealFile(deleteThumbIdx, sellerFileUploadPath, "seller");
	        }

	        // 새 로고파일 저장
	        Integer newThumbIdx = fileSave_svc.uploadFile(thumbnail, sellerFileUploadPath, "seller");
	        System.out.println("newThumbIdx : " + newThumbIdx);
	        sellerEntity.setLogoFileIdx(newThumbIdx);
	    }
		
	    // 나머지 상품 정보 업데이트
	    sellerEntity.profileUpdateFromDto(seller_dto);
	    seller_repo.save(sellerEntity);

	    return new SaveResultDto(true, null, "프로필 수정이 완료되었습니다.");
	}

}
