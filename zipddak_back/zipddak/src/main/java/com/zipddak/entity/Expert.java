package com.zipddak.entity;

import java.sql.Date;
import java.sql.Time;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.ExpertDto;
import com.zipddak.entity.User.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Expert {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer expertIdx;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "username")
	private User user;

	@Column(nullable = false)
	private String activityName;

	@Column
	private Integer profileImageIdx;

	@Column
	private String introduction;

	@Column
	private Integer mainServiceIdx;

	@Column
	private String zonecode;

	@Column
	private String addr1;

	@Column
	private String addr2;

	@Column
	private Integer employeeCount;

	@Column
	private Time contactStartTime;

	@Column
	private Time contactEndTime;

	@Column
	private String externalLink1;

	@Column
	private String externalLink2;

	@Column
	private String externalLink3;

	@Column
	private String providedServiceIdx; // 콤마 구분 문자열

	@Column(columnDefinition = "TEXT")
	private String providedServiceDesc;

	@Column
	private Integer certImage1Id;

	@Column
	private Integer certImage2Id;

	@Column
	private Integer certImage3Id;

	@Column
	private String businessLicense; // 사업자 등록번호 추가

	@Column
	private Integer businessLicensePdfId;

	@Column(columnDefinition = "TEXT")
	private String questionAnswer1;

	@Column(columnDefinition = "TEXT")
	private String questionAnswer2;

	@Column(columnDefinition = "TEXT")
	private String questionAnswer3;

	@Column
	private String settleBank;

	@Column
	private String settleAccount;

	@Column
	private String settleHost;

	@CreationTimestamp
	private Date createdAt;
	
	@Column
	private String activityStatus; // ACTIVE, WAITING, STOPPED, REJECT

	public ExpertDto toDto() {
		return ExpertDto.builder().expertIdx(expertIdx).username(user.getUsername()).activityName(activityName)
				.profileImageIdx(profileImageIdx).introduction(introduction).mainServiceIdx(mainServiceIdx)
				.zonecode(zonecode).addr1(addr1).addr2(addr2).employeeCount(employeeCount)
				.contactStartTime(contactStartTime).contactEndTime(contactEndTime).externalLink1(externalLink1)
				.externalLink2(externalLink2).externalLink3(externalLink3).providedServiceIdx(providedServiceIdx)
				.providedServiceDesc(providedServiceDesc).certImage1Id(certImage1Id).certImage2Id(certImage2Id)
				.certImage3Id(certImage3Id).businessLicensePdfId(businessLicensePdfId).questionAnswer1(questionAnswer1)
				.questionAnswer2(questionAnswer2).questionAnswer3(questionAnswer3).settleBank(settleBank)
				.settleAccount(settleAccount).settleHost(settleHost).createdAt(createdAt).activityStatus(activityStatus).build();
	}
}
