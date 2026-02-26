package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccountDto {
	private String username; // 유저 아이디
	private String nickname; // 닉네임
	private String password; // 비밀번호
	private String name; // 이름
	private String phone; // 전화번호
	private String zonecode; // 우편번호
	private String addr1; // 도로명 주소
	private String addr2; // 상세 주소
	private String settleBank; // 은행명
	private String settleAccount; // 계좌번호
	private String settleHost; // 예금주
	private String provider; // 소셜로그인 정보
	private String profile; // 프로필 이미지 리네임
}
