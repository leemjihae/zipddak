package com.zipddak.mypage.service;

import java.io.File;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.InquiriesDto;
import com.zipddak.dto.OrderItemDto;
import com.zipddak.entity.InquireFile;
import com.zipddak.entity.Inquiries;
import com.zipddak.entity.OrderItem;
import com.zipddak.mypage.dto.InquiryListDto;
import com.zipddak.mypage.repository.InquiryDslRepository;
import com.zipddak.repository.InquireFileRepository;
import com.zipddak.repository.InquiriesRepository;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

	private final InquiryDslRepository inquiryDslRepository;
	private final InquiriesRepository inquiriesRepository;
	private final InquireFileRepository inquireFileRepository;
	private final OrderItemRepository orderItemRepository;

	// 내가 작성한 문의목록 조회
	@Override
	public List<InquiryListDto> getMyInquiryList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		List<InquiryListDto> inquiryList = inquiryDslRepository.selectMyInquiryList(username, pageRequest);

		// 페이지 수 계산
		Long cnt = inquiryDslRepository.selectMyInquiryCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return inquiryList;
	}

	// 문의 작성
	@Override
	public void writeInquiry(InquiriesDto inquiriesDto, MultipartFile[] inquiriyImages) throws Exception {
		// 1. 파일 저장 & InquireFile 테이블에 insert
		Integer[] inquireFileIdxArr = new Integer[3];

		if (inquiriyImages != null) {
			for (int i = 0; i < inquiriyImages.length; i++) {
				MultipartFile file = inquiriyImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				String uploadDir = "/Users/eun/Documents/zipDDak_image/inequiriy/";
				File folder = new File(uploadDir);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(uploadDir + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				InquireFile inquireFile = InquireFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(uploadDir + rename).build();

				InquireFile savedFile = inquireFileRepository.save(inquireFile);

				// 1-6. inquiries 테이블 image1_idx ~ image3_idx 용 FK 설정
				inquireFileIdxArr[i] = savedFile.getInquireFileIdx();
			}
		}

		OrderItemDto orderItemDto = null;

		if (inquiriesDto.getOrderItemIdx() != null) {
			OrderItem orderItem = orderItemRepository.findById(inquiriesDto.getOrderItemIdx()).orElse(null);

			if (orderItem != null) {
				orderItemDto = orderItem.toDto();
			}
		}

		String answererUsername = (orderItemDto != null) ? orderItemDto.getSellerUsername() : null;

		// 2. inquiries 테이블 insert
		Inquiries inquiries = Inquiries.builder().type(inquiriesDto.getType()).content(inquiriesDto.getContent())
				.writerUsername(inquiriesDto.getWriterUsername()).writerType(inquiriesDto.getWriterType())
				.answererUsername(answererUsername).answererType(inquiriesDto.getAnswererType())
				.image1Idx(inquireFileIdxArr[0]).image2Idx(inquireFileIdxArr[1]).image3Idx(inquireFileIdxArr[2])
				.orderItemIdx(inquiriesDto.getOrderItemIdx()).build();

		inquiriesRepository.save(inquiries);

	}

}
