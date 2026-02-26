package com.zipddak.mypage.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.NotificationDto;
import com.zipddak.dto.ReviewExpertDto;
import com.zipddak.dto.ReviewProductDto;
import com.zipddak.dto.ReviewToolDto;
import com.zipddak.entity.ReviewExpert;
import com.zipddak.entity.ReviewFile;
import com.zipddak.entity.ReviewProduct;
import com.zipddak.entity.ReviewTool;
import com.zipddak.entity.Tool;
import com.zipddak.entity.User;
import com.zipddak.entity.Expert;
import com.zipddak.entity.Notification.NotificationType;
import com.zipddak.mypage.dto.BeforeExpertReviewDto;
import com.zipddak.mypage.dto.BeforeProductReviewDto;
import com.zipddak.mypage.dto.BeforeToolReviewDto;
import com.zipddak.mypage.dto.MyExpertReviewDto;
import com.zipddak.mypage.dto.MyProductReviewDto;
import com.zipddak.mypage.dto.MyToolReviewDto;
import com.zipddak.mypage.repository.ReviewDslRepository;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.ReviewExpertRepository;
import com.zipddak.repository.ReviewFileRepository;
import com.zipddak.repository.ReviewProductRepository;
import com.zipddak.repository.ReviewToolRepository;
import com.zipddak.repository.ToolRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

	private final ReviewDslRepository reviewDslRepository;
	private final ReviewToolRepository reviewToolRepository;
	private final ReviewProductRepository reviewProductRepository;
	private final ReviewExpertRepository reviewExpertRepository;
	private final ReviewFileRepository reviewFileRepository;
	private final NotificationServiceImpl notificationService;
	private final UserRepository userRepository;
	private final ToolRepository toolRepository;
	private final ExpertRepository expertRepository;

	@Value("${reviewFile.path}")
	private String reviewFilePath;

	@Override
	public List<BeforeToolReviewDto> beforeToolReviewList(String username) throws Exception {
		return reviewDslRepository.selectBeforeToolReview(username);
	}

	@Override
	public List<BeforeExpertReviewDto> beforeExpertReviewList(String username) throws Exception {
		return reviewDslRepository.selectBeforeExpertReview(username);
	}

	@Override
	public List<BeforeProductReviewDto> beforeProductReviewList(String username) throws Exception {
		return reviewDslRepository.selectBeforeProductReview(username);
	}

	@Override
	public void writeToolReview(ReviewToolDto reviewTooldto, MultipartFile[] reviewImages) throws Exception {
		// 1. 파일 저장 & ReviewFile 테이블에 insert
		Integer[] reviewFileIdxArr = new Integer[3];

		if (reviewImages != null) {
			for (int i = 0; i < reviewImages.length; i++) {
				MultipartFile file = reviewImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(reviewFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(reviewFilePath + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ReviewFile reviewFile = ReviewFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(reviewFilePath).build();

				ReviewFile savedFile = reviewFileRepository.save(reviewFile);

				// 1-6. reviewTool 테이블 image1_idx ~ image3_idx 용 FK 설정
				reviewFileIdxArr[i] = savedFile.getReviewFileIdx();
			}
		}

		// 2. reviewTool 테이블 insert
		ReviewTool reviewTool = ReviewTool.builder().score(reviewTooldto.getScore()).content(reviewTooldto.getContent())
				.writer(reviewTooldto.getWriter()).toolIdx(reviewTooldto.getToolIdx())
				.rentalIdx(reviewTooldto.getRentalIdx()).img1(reviewFileIdxArr[0]).img2(reviewFileIdxArr[1])
				.img3(reviewFileIdxArr[2]).build();

		ReviewTool saveReviewTool = reviewToolRepository.save(reviewTool);

		// 사용자 조회
		User user = userRepository.findById(reviewTooldto.getWriter()).get();

		// 공구 조회
		Tool tool = toolRepository.findById(reviewTooldto.getToolIdx()).get();

		// 알림 전송
		NotificationDto notificationDto = NotificationDto.builder().type(NotificationType.REVIEW).title("새로운 리뷰 도착")
				.content(user.getName() + "님이 리뷰를 작성했습니다.").recvUsername(tool.getOwner())
				.sendUsername(reviewTooldto.getWriter()).reviewType("TOOL").reviewIdx(saveReviewTool.getReviewToolIdx())
				.build();

		notificationService.sendNotification(notificationDto);
	}

	@Override
	public void writeExpertReview(ReviewExpertDto reviewExpertdto, MultipartFile[] reviewImages) throws Exception {
		// 1. 파일 저장 & ReviewFile 테이블에 insert
		Integer[] reviewFileIdxArr = new Integer[3];

		if (reviewImages != null) {
			for (int i = 0; i < reviewImages.length; i++) {
				MultipartFile file = reviewImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(reviewFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(reviewFilePath + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ReviewFile reviewFile = ReviewFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(reviewFilePath).build();

				ReviewFile savedFile = reviewFileRepository.save(reviewFile);

				// 1-6. reviewExpert 테이블 image1_idx ~ image3_idx 용 FK 설정
				reviewFileIdxArr[i] = savedFile.getReviewFileIdx();
			}
		}

		// 2. reviewExpert 테이블 insert
		ReviewExpert reviewExpert = ReviewExpert.builder().score(reviewExpertdto.getScore())
				.content(reviewExpertdto.getContent()).writer(reviewExpertdto.getWriter())
				.expertIdx(reviewExpertdto.getExpertIdx()).matchingIdx(reviewExpertdto.getMatchingIdx())
				.img1(reviewFileIdxArr[0]).img2(reviewFileIdxArr[1]).img3(reviewFileIdxArr[2]).build();

		ReviewExpert saveReviewExpert = reviewExpertRepository.save(reviewExpert);

		// 사용자 조회
		User user = userRepository.findById(reviewExpertdto.getWriter()).get();

		// 전문가 조회
		Expert expert = expertRepository.findById(reviewExpertdto.getExpertIdx()).get();

		// 알림 전송
		NotificationDto notificationDto = NotificationDto.builder().type(NotificationType.REVIEW).title("새로운 리뷰 도착")
				.content(user.getName() + "님이 리뷰를 작성했습니다.").recvUsername(expert.getUser().getUsername())
				.sendUsername(reviewExpertdto.getWriter()).reviewType("EXPERT")
				.reviewIdx(saveReviewExpert.getReviewExpertIdx()).build();

		notificationService.sendNotification(notificationDto);
	}

	@Override
	public void writeProductReview(ReviewProductDto reviewProductdto, MultipartFile[] reviewImages) throws Exception {
		// 1. 파일 저장 & ReviewFile 테이블에 insert
		Integer[] reviewFileIdxArr = new Integer[3];

		if (reviewImages != null) {
			for (int i = 0; i < reviewImages.length; i++) {
				MultipartFile file = reviewImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(reviewFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(reviewFilePath + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ReviewFile reviewFile = ReviewFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(reviewFilePath).build();

				ReviewFile savedFile = reviewFileRepository.save(reviewFile);

				// 1-6. reviewProduct 테이블 image1_idx ~ image3_idx 용 FK 설정
				reviewFileIdxArr[i] = savedFile.getReviewFileIdx();
			}
		}

		// 2. reviewProduct 테이블 insert
		ReviewProduct reviewProduct = ReviewProduct.builder().score(reviewProductdto.getScore())
				.content(reviewProductdto.getContent()).writer(reviewProductdto.getWriter())
				.productIdx(reviewProductdto.getProductIdx()).orderItemIdx(reviewProductdto.getOrderItemIdx())
				.img1(reviewFileIdxArr[0]).img2(reviewFileIdxArr[1]).img3(reviewFileIdxArr[2]).build();

		reviewProductRepository.save(reviewProduct);
	}

	// 이미지 삭제 함수
	private void deleteReviewFile(Integer fileIdx) {
		if (fileIdx == null)
			return;

		ReviewFile file = reviewFileRepository.findById(fileIdx).orElse(null);
		if (file == null)
			return;

		File f = new File(file.getStoragePath() + file.getFileRename());
		if (f.exists())
			f.delete();

		reviewFileRepository.delete(file);
	}

	@Override
	public void modifyToolReview(ReviewToolDto reviewTooldto, MultipartFile[] reviewImages) throws Exception {

		// 기존 리뷰 조회
		ReviewTool reviewTool = reviewToolRepository.findById(reviewTooldto.getReviewToolIdx())
				.orElseThrow(() -> new RuntimeException("잘못된 리뷰 아이디"));

		// 내용 & 점수 수정
		reviewTool.setContent(reviewTooldto.getContent());
		reviewTool.setScore(reviewTooldto.getScore());

		// 1. 기존 이미지 목록 조회
		List<Integer> oldImgIdxList = new ArrayList<>();
		if (reviewTool.getImg1() != null)
			oldImgIdxList.add(reviewTool.getImg1());
		if (reviewTool.getImg2() != null)
			oldImgIdxList.add(reviewTool.getImg2());
		if (reviewTool.getImg3() != null)
			oldImgIdxList.add(reviewTool.getImg3());

		// 2. 프론트에서 남긴 이미지 idx만 추출
		List<Integer> keepImgIdxList = new ArrayList<>();
		if (reviewTooldto.getImg1() != null)
			keepImgIdxList.add(reviewTooldto.getImg1());
		if (reviewTooldto.getImg2() != null)
			keepImgIdxList.add(reviewTooldto.getImg2());
		if (reviewTooldto.getImg3() != null)
			keepImgIdxList.add(reviewTooldto.getImg3());

		// 3. 기존 이미지 중 삭제된 이미지 추출 → 파일 삭제 + DB 삭제
		for (Integer oldIdx : oldImgIdxList) {
			if (!keepImgIdxList.contains(oldIdx)) {
				ReviewFile deleted = reviewFileRepository.findById(oldIdx).orElse(null);
				if (deleted != null) {
					// 실제 파일 삭제
					File file = new File(deleted.getStoragePath() + deleted.getFileRename());
					if (file.exists())
						file.delete();

					// DB delete
					reviewFileRepository.delete(deleted);
				}
			}
		}

		// 4. 새 이미지 저장
		List<Integer> newImgIdxList = new ArrayList<>();

		if (reviewImages != null) {
			for (MultipartFile mf : reviewImages) {
				if (mf == null || mf.isEmpty())
					continue;

				File folder = new File(reviewFilePath);
				if (!folder.exists())
					folder.mkdirs();

				String origin = mf.getOriginalFilename();
				String ext = origin.substring(origin.lastIndexOf("."));
				String rename = UUID.randomUUID() + ext;

				File saveFile = new File(reviewFilePath, rename);
				mf.transferTo(saveFile);

				ReviewFile saved = reviewFileRepository.save(
						ReviewFile.builder().fileName(origin).fileRename(rename).storagePath(reviewFilePath).build());

				newImgIdxList.add(saved.getReviewFileIdx());
			}
		}

		// 5. 기존 유지 이미지 + 새 이미지 합치기 (앞으로 자동 정렬됨)
		List<Integer> finalList = new ArrayList<>();
		finalList.addAll(keepImgIdxList);
		finalList.addAll(newImgIdxList);

		// 6. img1, img2, img3 재배치
		reviewTool.setImg1(finalList.size() > 0 ? finalList.get(0) : null);
		reviewTool.setImg2(finalList.size() > 1 ? finalList.get(1) : null);
		reviewTool.setImg3(finalList.size() > 2 ? finalList.get(2) : null);

		reviewToolRepository.save(reviewTool);
	}

	@Override
	public void modifyExpertReview(ReviewExpertDto reviewExpertdto, MultipartFile[] reviewImages) throws Exception {
		// 기존 리뷰 조회
		ReviewExpert reviewExpert = reviewExpertRepository.findById(reviewExpertdto.getReviewExpertIdx())
				.orElseThrow(() -> new RuntimeException("잘못된 리뷰 아이디"));

		// 내용 & 점수 수정
		reviewExpert.setContent(reviewExpertdto.getContent());
		reviewExpert.setScore(reviewExpertdto.getScore());

		// 1. 기존 이미지 목록 조회
		List<Integer> oldImgIdxList = new ArrayList<>();
		if (reviewExpert.getImg1() != null)
			oldImgIdxList.add(reviewExpert.getImg1());
		if (reviewExpert.getImg2() != null)
			oldImgIdxList.add(reviewExpert.getImg2());
		if (reviewExpert.getImg3() != null)
			oldImgIdxList.add(reviewExpert.getImg3());

		// 2. 프론트에서 남긴 이미지 idx만 추출
		List<Integer> keepImgIdxList = new ArrayList<>();
		if (reviewExpertdto.getImg1() != null)
			keepImgIdxList.add(reviewExpertdto.getImg1());
		if (reviewExpertdto.getImg2() != null)
			keepImgIdxList.add(reviewExpertdto.getImg2());
		if (reviewExpertdto.getImg3() != null)
			keepImgIdxList.add(reviewExpertdto.getImg3());

		// 3. 기존 이미지 중 삭제된 이미지 추출 → 파일 삭제 + DB 삭제
		for (Integer oldIdx : oldImgIdxList) {
			if (!keepImgIdxList.contains(oldIdx)) {
				ReviewFile deleted = reviewFileRepository.findById(oldIdx).orElse(null);
				if (deleted != null) {
					// 실제 파일 삭제
					File file = new File(deleted.getStoragePath() + deleted.getFileRename());
					if (file.exists())
						file.delete();

					// DB delete
					reviewFileRepository.delete(deleted);
				}
			}
		}

		// 4. 새 이미지 저장
		List<Integer> newImgIdxList = new ArrayList<>();

		if (reviewImages != null) {
			for (MultipartFile mf : reviewImages) {
				if (mf == null || mf.isEmpty())
					continue;

				File folder = new File(reviewFilePath);
				if (!folder.exists())
					folder.mkdirs();

				String origin = mf.getOriginalFilename();
				String ext = origin.substring(origin.lastIndexOf("."));
				String rename = UUID.randomUUID() + ext;

				File saveFile = new File(reviewFilePath, rename);
				mf.transferTo(saveFile);

				ReviewFile saved = reviewFileRepository.save(
						ReviewFile.builder().fileName(origin).fileRename(rename).storagePath(reviewFilePath).build());

				newImgIdxList.add(saved.getReviewFileIdx());
			}
		}

		// 5. 기존 유지 이미지 + 새 이미지 합치기 (앞으로 자동 정렬됨)
		List<Integer> finalList = new ArrayList<>();
		finalList.addAll(keepImgIdxList);
		finalList.addAll(newImgIdxList);

		// 6. img1, img2, img3 재배치
		reviewExpert.setImg1(finalList.size() > 0 ? finalList.get(0) : null);
		reviewExpert.setImg2(finalList.size() > 1 ? finalList.get(1) : null);
		reviewExpert.setImg3(finalList.size() > 2 ? finalList.get(2) : null);

		reviewExpertRepository.save(reviewExpert);
	}

	@Override
	public void modifyProductReview(ReviewProductDto reviewProductdto, MultipartFile[] reviewImages) throws Exception {
		// 기존 리뷰 조회
		ReviewProduct reviewProduct = reviewProductRepository.findById(reviewProductdto.getReviewProductIdx())
				.orElseThrow(() -> new RuntimeException("잘못된 리뷰 아이디"));

		// 내용 & 점수 수정
		reviewProduct.setContent(reviewProductdto.getContent());
		reviewProduct.setScore(reviewProductdto.getScore());

		// 1. 기존 이미지 목록 조회
		List<Integer> oldImgIdxList = new ArrayList<>();
		if (reviewProduct.getImg1() != null)
			oldImgIdxList.add(reviewProduct.getImg1());
		if (reviewProduct.getImg2() != null)
			oldImgIdxList.add(reviewProduct.getImg2());
		if (reviewProduct.getImg3() != null)
			oldImgIdxList.add(reviewProduct.getImg3());

		// 2. 프론트에서 남긴 이미지 idx만 추출
		List<Integer> keepImgIdxList = new ArrayList<>();
		if (reviewProductdto.getImg1() != null)
			keepImgIdxList.add(reviewProductdto.getImg1());
		if (reviewProductdto.getImg2() != null)
			keepImgIdxList.add(reviewProductdto.getImg2());
		if (reviewProductdto.getImg3() != null)
			keepImgIdxList.add(reviewProductdto.getImg3());

		// 3. 기존 이미지 중 삭제된 이미지 추출 → 파일 삭제 + DB 삭제
		for (Integer oldIdx : oldImgIdxList) {
			if (!keepImgIdxList.contains(oldIdx)) {
				ReviewFile deleted = reviewFileRepository.findById(oldIdx).orElse(null);
				if (deleted != null) {
					// 실제 파일 삭제
					File file = new File(deleted.getStoragePath() + deleted.getFileRename());
					if (file.exists())
						file.delete();

					// DB delete
					reviewFileRepository.delete(deleted);
				}
			}
		}

		// 4. 새 이미지 저장
		List<Integer> newImgIdxList = new ArrayList<>();

		if (reviewImages != null) {
			for (MultipartFile mf : reviewImages) {
				if (mf == null || mf.isEmpty())
					continue;

				File folder = new File(reviewFilePath);
				if (!folder.exists())
					folder.mkdirs();

				String origin = mf.getOriginalFilename();
				String ext = origin.substring(origin.lastIndexOf("."));
				String rename = UUID.randomUUID() + ext;

				File saveFile = new File(reviewFilePath, rename);
				mf.transferTo(saveFile);

				ReviewFile saved = reviewFileRepository.save(
						ReviewFile.builder().fileName(origin).fileRename(rename).storagePath(reviewFilePath).build());

				newImgIdxList.add(saved.getReviewFileIdx());
			}
		}

		// 5. 기존 유지 이미지 + 새 이미지 합치기 (앞으로 자동 정렬됨)
		List<Integer> finalList = new ArrayList<>();
		finalList.addAll(keepImgIdxList);
		finalList.addAll(newImgIdxList);

		// 6. img1, img2, img3 재배치
		reviewProduct.setImg1(finalList.size() > 0 ? finalList.get(0) : null);
		reviewProduct.setImg2(finalList.size() > 1 ? finalList.get(1) : null);
		reviewProduct.setImg3(finalList.size() > 2 ? finalList.get(2) : null);

		reviewProductRepository.save(reviewProduct);
	}

	@Override
	public void deleteToolReview(Integer reivewToolIdx) throws Exception {
		ReviewTool reviewTool = reviewToolRepository.findById(reivewToolIdx)
				.orElseThrow(() -> new RuntimeException("잘못된 리뷰 아이디"));

		reviewToolRepository.delete(reviewTool);
	}

	@Override
	public void deleteExpertReview(Integer reivewExpertIdx) throws Exception {
		ReviewExpert reviewExpert = reviewExpertRepository.findById(reivewExpertIdx)
				.orElseThrow(() -> new RuntimeException("잘못된 리뷰 아이디"));

		reviewExpertRepository.delete(reviewExpert);
	}

	@Override
	public void deleteProductReview(Integer reivewProductIdx) throws Exception {
		ReviewProduct reviewProduct = reviewProductRepository.findById(reivewProductIdx)
				.orElseThrow(() -> new RuntimeException("잘못된 리뷰 아이디"));

		reviewProductRepository.delete(reviewProduct);
	}

	@Override
	public List<MyToolReviewDto> myToolReviewList(String username) throws Exception {
		return reviewDslRepository.selectMyToolReviewList(username);
	}

	@Override
	public List<MyExpertReviewDto> myExpertReviewList(String username) throws Exception {
		return reviewDslRepository.selectMyExpertReviewList(username);
	}

	@Override
	public List<MyProductReviewDto> myProductReviewList(String username) throws Exception {
		return reviewDslRepository.selectMyProductReviewList(username);
	}

	@Override
	public List<MyToolReviewDto> receiveToolReviewList(String username) throws Exception {
		return reviewDslRepository.selectReceiveToolReviewList(username);
	}

}
