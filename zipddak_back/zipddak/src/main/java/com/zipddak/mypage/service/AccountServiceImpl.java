package com.zipddak.mypage.service;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.UserDto;
import com.zipddak.entity.ProfileFile;
import com.zipddak.entity.User;
import com.zipddak.mypage.dto.UserAccountDto;
import com.zipddak.repository.ProfileFileRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

	private final UserRepository userRepository;
	private final ProfileFileRepository profileFileRepository;

	@Value("${profileFile.path}")
	private String profileFilePath;

	// 유저 정보 불러오기
	@Override
	public UserAccountDto getUserAccountDetail(String username) throws Exception {
		User user = userRepository.findById(username).orElseThrow(() -> new RuntimeException("잘못된 유저 아이디"));

		UserAccountDto userAccountDto = UserAccountDto.builder().username(user.getUsername())
				.nickname(user.getNickname()).password(user.getPassword()).name(user.getName()).phone(user.getPhone())
				.zonecode(user.getZonecode()).addr1(user.getAddr1()).addr2(user.getAddr2())
				.settleBank(user.getSettleBank()).settleAccount(user.getSettleAccount())
				.settleHost(user.getSettleHost()).provider(user.getProvider()).build();

		if (user.getProfileImg() != null) {
			ProfileFile profileFile = profileFileRepository.findById(user.getProfileImg()).orElse(null);
			if (profileFile != null) {
				userAccountDto.setProfile(profileFile.getFileRename());
			}
		}

		return userAccountDto;
	}

	// 유저 정보 수정
	@Override
	public void modifyUserAccount(UserDto userDto, MultipartFile profileImage) throws Exception {
		// 1. 프로필 파일 저장 & ProfileFile 테이블에 insert
		Integer profileFileIdxArr = 0;

		if (profileImage != null) {
			MultipartFile file = profileImage;
			if (file != null || !(file.isEmpty())) {

				// 1-1. 저장 경로 설정
				File folder = new File(profileFilePath);
				if (!folder.exists())
					folder.mkdirs();

				// 1-2. 원본파일명
				String originalFileName = file.getOriginalFilename();

				// 1-3. 리네임 파일명 생성 (UUID)
				String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
				String rename = UUID.randomUUID().toString();

				// 1-4. 실제 파일 저장
				File saveFile = new File(profileFilePath + "/" +  rename);
				file.transferTo(saveFile);

				// 1-5. DB 저장
				ProfileFile profileFile = ProfileFile.builder().fileName(originalFileName).fileRename(rename)
						.storagePath(profileFilePath).build();

				ProfileFile savedFile = profileFileRepository.save(profileFile);

				// 1-6. User 테이블 FK 설정
				profileFileIdxArr = savedFile.getProfileFileIdx();
			}
		}

		// 기존 User 조회
		User user = userRepository.findById(userDto.getUsername())
				.orElseThrow(() -> new RuntimeException("잘못된 유저 아이디"));

		user.setNickname(userDto.getNickname());
		user.setPassword(userDto.getPassword());
		user.setName(userDto.getName());
		user.setPhone(userDto.getPhone());
		user.setZonecode(userDto.getZonecode());
		user.setAddr1(userDto.getAddr1());
		user.setAddr2(userDto.getAddr2());
		user.setSettleBank(userDto.getSettleBank());
		user.setSettleHost(userDto.getSettleHost());
		user.setSettleAccount(userDto.getSettleAccount());

		if (profileFileIdxArr != 0) {
			user.setProfileImg(profileFileIdxArr);
		}

		userRepository.save(user);
	}
}
