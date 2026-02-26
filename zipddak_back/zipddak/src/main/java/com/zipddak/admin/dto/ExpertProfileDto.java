package com.zipddak.admin.dto;

import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertProfileDto {

	private String activityName; // 전문가 활동명
	private Integer expertIdx; // 전문가 IDX
	private String imgFileRename; // 이미지 파일 이름
	private String imgStoragePath; // 이미지 저장 경로
	private Integer mainServiceIdx; // 메인 서비스 idx
	private String mainServiceName; // 메인 서비스 이름
	private String introduction; // 자기소개
	private String addr1; // 주소 1
	private String addr2; // 주소 2
	private Integer employeeCount; // 직원수
	private Time contactStartTime; // 연락 가능 시작 시간
	private Time contactEndTime; // 연락 가능 끝 시간
	private String externalLink1; // 외부 링크 1
	private String externalLink2; // 외부 링크 2
	private String externalLink3; // 외부 링크 3
	private String certImage1; // 자격증1 이미지 이름
	private String certImage2; // 자격증2 이미지 이름
	private String certImage3; // 자격증3 이미지 이름
	
	private String questionAnswer1; // 질문 답변1
	private String questionAnswer2; // 질문 답변2
	private String questionAnswer3; // 질문 답변3
	
	// 제공 서비스 목록
	private String providedServiceIdx; // 제공 서비스 idx 목록
	private String providedServiceDesc; // 제공 서비스 설명
	
	
	
	
}
