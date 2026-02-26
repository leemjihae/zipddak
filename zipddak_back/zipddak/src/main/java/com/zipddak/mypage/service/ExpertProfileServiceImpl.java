package com.zipddak.mypage.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.zipddak.dto.CareerDto;
import com.zipddak.dto.ExpertDto;
import com.zipddak.dto.PortfolioDto;
import com.zipddak.entity.Career;
import com.zipddak.entity.Expert;
import com.zipddak.entity.ExpertFile;
import com.zipddak.entity.Portfolio;
import com.zipddak.mypage.dto.ExpertProfileDto;
import com.zipddak.mypage.dto.ExpertSettleDto;
import com.zipddak.mypage.dto.PortfolioListDto;
import com.zipddak.mypage.repository.ExpertDslRepository;
import com.zipddak.repository.CareerRepository;
import com.zipddak.repository.ExpertFileRepository;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.PortfolioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertProfileServiceImpl implements ExpertProfileService {

	private final ExpertRepository expertRepository;
	private final ExpertDslRepository expertDslRepository;
	private final CareerRepository careerRepository;
	private final PortfolioRepository portfolioRepository;
	private final ExpertFileRepository expertFileRepository;

	@Value("${expertFile.path}")
	private String expertFilePath;

	// 전문가 상세 조회
	@Override
	public ExpertProfileDto getExpertProfileDetail(String username) throws Exception {

		// 1. 기본 프로필 정보 조회
		ExpertProfileDto profile = expertDslRepository.selectExpertProfileBase(username);

		if (profile == null) {
			return null;
		}

		Integer expertIdx = profile.getExpertIdx();

		// 2. providedServiceIdx → List<Integer> 변환
		List<Integer> providedIdxList = convertToIntList(profile.getProvidedServiceIdx());

		// 3. 제공 서비스 카테고리명 조회 & 세팅
		List<String> providedService = expertDslRepository.selectProvidedServiceByIdxList(providedIdxList);
		profile.setProvidedService(providedService);

		// 4. 경력 목록 조회 & 세팅
		List<CareerDto> careerList = expertDslRepository.selectCareerList(expertIdx);
		profile.setCareerList(careerList);

		// 5. 포트폴리오 목록 조회 & 세팅
		List<PortfolioListDto> portfolioList = expertDslRepository.selectPortfolioList(expertIdx);
		profile.setPortfolioList(portfolioList);

		return profile;
	}

	// 문자열 -> 리스트
	private List<Integer> convertToIntList(String csv) {
		if (csv == null || csv.isEmpty()) {
			return Collections.emptyList();
		}

		return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).map(Integer::valueOf)
				.collect(Collectors.toList());
	}

	// 전문가 프로필 수정
	@Override
	public void modifyExpertProfile(ExpertDto expertDto, MultipartFile profileImage, MultipartFile businessImage,
			MultipartFile[] certificateImages) throws Exception {
		// 1. 자격증 파일 저장 & ExpertFile 테이블에 insert
		Integer[] certificateFileIdxArr = new Integer[3];

		if (certificateImages != null) {
			for (int i = 0; i < certificateImages.length; i++) {
				MultipartFile file = certificateImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(expertFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(expertFilePath + "/" + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ExpertFile expertFile = ExpertFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(expertFilePath).build();

				ExpertFile savedFile = expertFileRepository.save(expertFile);

				// 1-6. Expert 테이블 image1_idx ~ image3_idx 용 FK 설정
				certificateFileIdxArr[i] = savedFile.getExpertFileIdx();
			}
		}

		// 2. 사업자등록증 파일 저장 & ExpertFile 테이블에 insert
		Integer businessFileIdxArr = 0;

		if (businessImage != null) {

			MultipartFile file = businessImage;
			if (file != null || !(file.isEmpty())) {

				// 1-1. 저장 경로 설정
				File folder = new File(expertFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(expertFilePath + "/" + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ExpertFile expertFile = ExpertFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(expertFilePath).build();

				ExpertFile savedFile = expertFileRepository.save(expertFile);

				// 1-6. Expert 테이블 FK 설정
				businessFileIdxArr = savedFile.getExpertFileIdx();
			}
		}

		// 3. 프로필 파일 저장 & ExpertFile 테이블에 insert
		Integer profileFileIdxArr = 0;

		if (profileImage != null) {

			MultipartFile file = profileImage;
			if (file != null || !(file.isEmpty())) {

				// 1-1. 저장 경로 설정
				File folder = new File(expertFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				// 1-4. 실제 파일 저장
				File saveFile = new File(expertFilePath + "/" + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ExpertFile expertFile = ExpertFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(expertFilePath).build();

				ExpertFile savedFile = expertFileRepository.save(expertFile);

				Expert expert = expertRepository.findById(expertDto.getExpertIdx()).get();
				expert.setProfileImageIdx(savedFile.getExpertFileIdx());
				
				expertRepository.save(expert);
				// 1-6. Expert 테이블 FK 설정
				profileFileIdxArr = savedFile.getExpertFileIdx();
			}
		}

		// 기존 Expert 조회
		Expert expert = expertRepository.findById(expertDto.getExpertIdx())
				.orElseThrow(() -> new RuntimeException("잘못된 전문가 아이디"));

		expert.setActivityName(expertDto.getActivityName());
		if (profileFileIdxArr != 0) {
			expert.setProfileImageIdx(profileFileIdxArr);
		}
		expert.setIntroduction(expertDto.getIntroduction());
		expert.setMainServiceIdx(expertDto.getMainServiceIdx());
		expert.setZonecode(expertDto.getZonecode());
		expert.setAddr1(expertDto.getAddr1());
		expert.setAddr2(expertDto.getAddr2());
		expert.setEmployeeCount(expertDto.getEmployeeCount());
		expert.setContactStartTime(expertDto.getContactStartTime());
		expert.setContactEndTime(expertDto.getContactEndTime());
		expert.setExternalLink1(expertDto.getExternalLink1());
		expert.setExternalLink2(expertDto.getExternalLink2());
		expert.setExternalLink3(expertDto.getExternalLink3());
		expert.setProvidedServiceIdx(expertDto.getProvidedServiceIdx());
		expert.setProvidedServiceDesc(expertDto.getProvidedServiceDesc());
		expert.setCertImage1Id(certificateFileIdxArr[0]);
		expert.setCertImage2Id(certificateFileIdxArr[1]);
		expert.setCertImage3Id(certificateFileIdxArr[2]);
		if (businessFileIdxArr != 0) {
			expert.setBusinessLicensePdfId(businessFileIdxArr);
		}
		expert.setQuestionAnswer1(expertDto.getQuestionAnswer1());
		expert.setQuestionAnswer2(expertDto.getQuestionAnswer2());
		expert.setQuestionAnswer3(expertDto.getQuestionAnswer3());

		expertRepository.save(expert);
	}

	// 포트폴리오 추가
	@Override
	public String addPortfolio(PortfolioDto portfolioDto, MultipartFile[] portfolioImages) throws Exception {
		String img1Rename = "";

		// 1. 파일 저장 & ExpertFile 테이블에 insert
		Integer[] portfolioFileIdxArr = new Integer[3];

		if (portfolioImages != null) {
			for (int i = 0; i < portfolioImages.length; i++) {
				MultipartFile file = portfolioImages[i];
				if (file == null || file.isEmpty())
					continue;

				// 1-1. 저장 경로 설정
				File folder = new File(expertFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString() + ext;

				if (i == 0)
					img1Rename = rename;

				// 1-4. 실제 파일 저장
				File saveFile = new File(expertFilePath +"/" + rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ExpertFile expertFile = ExpertFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(expertFilePath).build();

				ExpertFile savedFile = expertFileRepository.save(expertFile);

				// 1-6. portfolio 테이블 image1_idx ~ image3_idx 용 FK 설정
				portfolioFileIdxArr[i] = savedFile.getExpertFileIdx();
			}
		}

		// 2. Portfolio 테이블 insert
		Portfolio portfolio = Portfolio.builder().expertIdx(portfolioDto.getExpertIdx()).title(portfolioDto.getTitle())
				.serviceIdx(portfolioDto.getServiceIdx()).region(portfolioDto.getRegion())
				.price(portfolioDto.getPrice()).workTimeType(portfolioDto.getWorkTimeType())
				.workTimeValue(portfolioDto.getWorkTimeValue()).image1Idx(portfolioFileIdxArr[0])
				.image2Idx(portfolioFileIdxArr[1]).image3Idx(portfolioFileIdxArr[2])
				.description(portfolioDto.getDescription()).build();

		portfolioRepository.save(portfolio);

		return img1Rename;
	}

	// 포트폴리오 삭제
	@Override
	public void deletePortfolio(Integer portfolioIdx) throws Exception {
		Portfolio portfolio = portfolioRepository.findById(portfolioIdx)
				.orElseThrow(() -> new RuntimeException("잘못된 포트폴리오 아이디"));

		portfolioRepository.delete(portfolio);
	}

	// 경력 추가
	@Override
	public void addCareer(CareerDto careerDto) throws Exception {
		Career career = Career.builder().expertIdx(careerDto.getExpertIdx()).title(careerDto.getTitle())
				.startDate(careerDto.getStartDate()).endDate(careerDto.getEndDate())
				.description(careerDto.getDescription()).months(careerDto.getMonths()).build();

		careerRepository.save(career);
	}

	// 경력 삭제
	@Override
	public void deleteCareer(Integer careerIdx) throws Exception {
		Career career = careerRepository.findById(careerIdx).orElseThrow(() -> new RuntimeException("잘못된 경력 아이디"));

		careerRepository.delete(career);
	}

	// 전문가 정산계좌 정보 조회
	@Override
	public ExpertSettleDto getExpertSettleDetail(String username) throws Exception {
		Expert expert = expertRepository.findByUser_Username(username).get();
		
		ExpertSettleDto expertSettleDto = new ExpertSettleDto();
		
		expertSettleDto.setSettleBank(expert.getSettleBank());
		expertSettleDto.setSettleAccount(expert.getSettleAccount());
		expertSettleDto.setSettleHost(expert.getSettleHost());
		expertSettleDto.setActivityStatus(expert.getActivityStatus());
		
		return expertSettleDto;
	}

	// 전문가 정산계좌 정보 수정
	@Override
	public void modifyExpertSettle(String username, ExpertSettleDto expertSettleDto) throws Exception {
		Expert expert = expertRepository.findByUser_Username(username).get();
		
		expert.setSettleBank(expertSettleDto.getSettleBank());
		expert.setSettleAccount(expertSettleDto.getSettleAccount());
		expert.setSettleHost(expertSettleDto.getSettleHost());
		
		expertRepository.save(expert);
	}

	
	// 전문가 활동상태 토글
	@Override
	public void toggleActivityStatus(String username) throws Exception {
		Expert expert = expertRepository.findByUser_Username(username).get();
		System.out.print(expert.getActivityStatus());
		
		if(expert.getActivityStatus().equals("ACTIVE")) 
			expert.setActivityStatus("STOPPED");
		else expert.setActivityStatus("ACTIVE");
		
		expertRepository.save(expert);
	}
}
