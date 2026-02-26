package com.zipddak.util;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.entity.ProductFile;
import com.zipddak.entity.SellerFile;
import com.zipddak.repository.ProductFileRepository;
import com.zipddak.repository.SellerFileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileSaveService {
	//파일 저장 실제 수행하는 File 업로드 처리 서비스 

    private final FileSaveUtil fileSaveUtil;
    private final ProductFileRepository productFile_repo;
    private final SellerFileRepository sellerFile_repo;

    // 상품관련 파일 저장 + File INSERT + PK 리턴
    public Integer uploadFile(MultipartFile multipartFile, String uploadPath, String FileType) throws Exception {

    	//첨부 파일이 없을 경우 
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }

        //원래 파일명
        String originalFileName = multipartFile.getOriginalFilename();
        //파일 리네임
        String storedFileName   = fileSaveUtil.createFileReName(originalFileName);

        // 실제 파일 시스템 저장
        fileSaveUtil.saveFile(multipartFile, uploadPath, storedFileName);

        // DB 저장
        if(FileType.equals("product")) { //(ProductFile 테이블에 저장)
			ProductFile productFileEntity = productFile_repo.save(ProductFile.builder()
												                     .fileName(originalFileName)
												                     .fileRename(storedFileName)
												                     .storagePath(uploadPath)
												                     .build());
									
			return productFileEntity.getProductFileIdx();
        	
        } else if(FileType.equals("seller")){
        	SellerFile sellerFileEntity = sellerFile_repo.save(SellerFile.builder()
											                    .fileName(originalFileName)
											                    .fileRename(storedFileName)
											                    .storagePath(uploadPath)
											                    .build());

    		return sellerFileEntity.getSellerFileIdx();
    		
        } else {
        	
        	return null;
        }
       
    }
    
    
    // 상품 실제파일 삭제
    @Transactional
    public boolean deleteRealFile(Integer fileIdx, String uploadPath, String FileType) throws Exception {
    	System.out.println("fileIdx service : " + fileIdx);
    	
    	//삭제된 파일이 없는 경우 
    	if (fileIdx == null) {
            return false;
        }

        //저장된 파일명 찾기 
    	ProductFile file = productFile_repo.findById(fileIdx).orElseThrow(() -> new IllegalArgumentException("파일 정보 없음"));
    	String storedFileName = file.getFileRename();

        // 실제 파일 삭제 
    	fileSaveUtil.deleteFileIfExists(uploadPath, storedFileName);

        // DB에서도 삭제
        if (FileType.equals("product")) {
            productFile_repo.deleteById(fileIdx);
        }else if(FileType.equals("seller")) {
        	sellerFile_repo.deleteById(fileIdx);
        }

        return true;
    }
    
    
    
   

}
