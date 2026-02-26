package com.zipddak.admin.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.admin.dto.EstimatePaymentRequestDetailDto;
import com.zipddak.admin.dto.RequestFormDto;
import com.zipddak.admin.repository.RequestDetailDslRepository;
import com.zipddak.dto.NotificationDto;
import com.zipddak.dto.RequestDto;
import com.zipddak.entity.Estimate;
import com.zipddak.entity.Expert;
import com.zipddak.entity.ExpertFile;
import com.zipddak.entity.Request;
import com.zipddak.entity.User;
import com.zipddak.entity.Notification.NotificationType;
import com.zipddak.mypage.service.NotificationServiceImpl;
import com.zipddak.repository.CategoryRepository;
import com.zipddak.repository.EstimateRepository;
import com.zipddak.repository.ExpertFileRepository;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.RequestRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RequestServiceImpl implements RequestService {

	private final RequestDetailDslRepository requestDslRepository;

	private final RequestRepository requestRepository;
	private final ExpertFileRepository expertFileRepository;
	private final CategoryRepository categoryRepository;
	private final NotificationServiceImpl notificationService;
	private final UserRepository userRepository;
	private final ExpertRepository expertRepository;

	@Value("${expertFile.path}")
	private String expertFilePath;

	@Override
	public void writeRequest(RequestFormDto requestForm) throws Exception {

		List<Integer> fileIdxList = new ArrayList<Integer>();

		// 1. 이미지 파일 저장하기
		if (requestForm.getFiles() != null) {
			for (MultipartFile file : requestForm.getFiles()) {

				String fileName = file.getOriginalFilename();

				// 확장자
				String ext = fileName.substring(fileName.lastIndexOf("."));

				String fileRename = UUID.randomUUID().toString() + ext;

				ExpertFile expertFile = ExpertFile.builder().fileName(fileName).fileRename(fileRename)
						.storagePath(expertFilePath).build();

				try {
					File saveFile = new File(expertFilePath + File.separator + fileRename);

					// 폴더가 없으면 생성
					if (!saveFile.getParentFile().exists()) {
						saveFile.getParentFile().mkdirs();
					}

					file.transferTo(saveFile); // 실제 파일 저장
				} catch (IOException e) {
					e.printStackTrace();
				}

				ExpertFile savedExpertFile = expertFileRepository.save(expertFile);

				// 저장한 이미지의 아이디를 리스트에 저장
				// -> 요청서 만들때 이미지 아이디를 써야함
				fileIdxList.add(savedExpertFile.getExpertFileIdx());
			}
		}

		// 2. 요청서 생성후 저장
		// 가져온 데이터에서 카테고리 1, 2, 3 에 맞는 idx를 가져와야함
		Integer cate1 = categoryRepository.findByName(requestForm.getCate1()).getCategoryIdx();

		// 시공 견적은 cate2 / 3없음

		int cate2 = 0;
		int cate3 = 0;
		if (cate1 != 74) {
			cate2 = categoryRepository.findByName(requestForm.getCate2()).getCategoryIdx();
			cate3 = categoryRepository.findByName(requestForm.getCate3()).getCategoryIdx();
		}

		Request request = Request.builder()
				.userUsername(requestForm.getUserUsername())
				.largeServiceIdx(cate1)
				.budget(requestForm.getBudget())
				.preferredDate(requestForm.getPreferredDate())
				.location(requestForm.getAddr1() + " " + requestForm.getAddr2())
				.constructionSize(requestForm.getConstructionSize())
				.additionalRequest(requestForm.getAdditionalRequest())
				.purpose(requestForm.getPurpose())
				.place(requestForm.getPlace())
				.status("RECRUITING")
				.build();
		
		if(cate1 != 74) {
			request.setMidServiceIdx(cate2);
			request.setSmallServiceIdx(cate3);
		}

		if (fileIdxList.size() > 0) {
			request.setImage1Idx(fileIdxList.get(0));
		}

		if (fileIdxList.size() > 1) {
			request.setImage2Idx(fileIdxList.get(1));
		}

		if (fileIdxList.size() > 2) {
			request.setImage3Idx(fileIdxList.get(2));
		}

		Request saveRequest = requestRepository.save(request);
		
		if (!requestForm.getExpertIdx().equals("null")) {
			saveRequest.setExpertIdx(Integer.parseInt(requestForm.getExpertIdx()));

			// 사용자 검색
			User user = userRepository.findById(requestForm.getUserUsername()).get();

			// 전문가 검색
			Expert expert = expertRepository.findById(Integer.valueOf(requestForm.getExpertIdx())).get();
			
			// 알림 전송
			NotificationDto notificationDto = NotificationDto.builder().type(NotificationType.REQUEST)
					.title("새로운 요청 도착").content(user.getName() + "님이 요청서를 보냈습니다.")
					.recvUsername(expert.getUser().getUsername()).sendUsername(requestForm.getUserUsername())
					.requestIdx(saveRequest.getRequestIdx()).build();

			notificationService.sendNotification(notificationDto);

			requestRepository.save(request);
		}

	}

	@Override
	public EstimatePaymentRequestDetailDto detail(Integer estimateIdx, String username) throws Exception {

		return requestDslRepository.findByEstimateIdx(estimateIdx);
	}

	// 진행중인 요청서가 있는지 확인
	@Override
	public boolean requestCheck(String username) throws Exception {
	
		Optional<Request> request = requestRepository.findByUserUsernameAndStatus(username, "RECRUITING");
		
		return request.isPresent() ? true : false;
		
	}

}
