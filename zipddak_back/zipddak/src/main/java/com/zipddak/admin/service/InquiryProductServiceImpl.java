package com.zipddak.admin.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.admin.dto.WriteInquiryDto;
import com.zipddak.entity.ExpertFile;
import com.zipddak.entity.InquireFile;
import com.zipddak.entity.Inquiries;
import com.zipddak.entity.Inquiries.AnswererType;
import com.zipddak.entity.Inquiries.InquiryType;
import com.zipddak.entity.Inquiries.WriterType;
import com.zipddak.entity.Product;
import com.zipddak.repository.InquireFileRepository;
import com.zipddak.repository.InquiriesRepository;
import com.zipddak.repository.ProductFileRepository;
import com.zipddak.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryProductServiceImpl implements InquiryService {

	private final InquiriesRepository inquiriesRepository;
	private final InquireFileRepository inquireFileRepository;
	
	private final ProductRepository productRepository;
	
	@Value("${inquireFile.path}")
	private String inquireFilePath;
	
	@Override
	public void writeInquire(WriteInquiryDto writeInquiryDto) throws Exception {
		
		List<Integer> fileIdxList = new ArrayList<Integer>();
		
		// 1. 이미지 파일 저장하기
				if (writeInquiryDto.getFiles() != null) {
					for (MultipartFile file : writeInquiryDto.getFiles()) {

						String fileName = file.getOriginalFilename();

						// 확장자
						String ext = fileName.substring(fileName.lastIndexOf("."));

						String fileRename = UUID.randomUUID().toString() + ext;

						InquireFile inquireFile = InquireFile.builder().fileName(fileName).fileRename(fileRename)
								.storagePath(inquireFilePath).build();

						try {
							File saveFile = new File(inquireFilePath + File.separator + fileRename);

							// 폴더가 없으면 생성
							if (!saveFile.getParentFile().exists()) {
								saveFile.getParentFile().mkdirs();
							}

							file.transferTo(saveFile); // 실제 파일 저장
						} catch (IOException e) {
							e.printStackTrace();
						}

						InquireFile savedInquireFile = inquireFileRepository.save(inquireFile);

						// 저장한 이미지의 아이디를 리스트에 저장
						// -> 요청서 만들때 이미지 아이디를 써야함
						fileIdxList.add(savedInquireFile.getInquireFileIdx());
					}
				}
				
				Product product = productRepository.findById(writeInquiryDto.getProductIdx()).orElseThrow(() -> new Exception("문의 등록 중 판매 업체 아이디 불러오는 중 에러"));
				
				Inquiries inqu = Inquiries.builder()
								.type(InquiryType.PRODUCT)
								.content(writeInquiryDto.getContent())
								.writerUsername(writeInquiryDto.getUsername())
								.writerType(WriterType.USER)
								.productIdx(writeInquiryDto.getProductIdx())
								.answererType(AnswererType.SELLER)
								.answererUsername(product.getSellerUsername())
								.build();
				
				if (fileIdxList.size() > 0) {
					inqu.setImage1Idx(fileIdxList.get(0));
				}

				if (fileIdxList.size() > 1) {
					inqu.setImage2Idx(fileIdxList.get(1));
				}

				if (fileIdxList.size() > 2) {
					inqu.setImage3Idx(fileIdxList.get(2));
				}
				
				inquiriesRepository.save(inqu);
		
	}

}
