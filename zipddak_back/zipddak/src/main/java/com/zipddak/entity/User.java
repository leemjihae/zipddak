package com.zipddak.entity;

import java.sql.Date;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.UserDto;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class User {

    @Id
    @Column(nullable = false)
    private String username; //아이디(이메일)

    @Column(nullable = false)
    private String nickname; //닉네임

    @Column
    private String password; //비밀번호

    @Column(nullable = false) //이름
    private String name;

    @Column(nullable = false) //휴대폰
    private String phone;

    @Column
    private String zonecode; //주소-우편번호

    @Column
    private String addr1; //주소-도로명/지번

    @Column
    private String addr2; //주소-상세주소

    @Column
    private String settleBank;

    @Column
    private String settleAccount;

    @Column
    private String settleHost;

    @Column
    private String provider;

    @Column
    private String providerId;

    @Column
    private String fcmToken;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role; // USER, ADMIN, APPROVAL_SELLER

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserState state;
    
    @Column
    private Boolean expert; // 전문가 전환 여부
    
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Expert expertInfo;
    
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Seller sellertInfo;

    @CreationTimestamp
    private Date createdate;

    @Column
    private Integer profileImg;

    public enum UserRole {
        USER, ADMIN, EXPERT, APPROVAL_SELLER, SELLER
    }
    
    public enum UserState {
    	ACTIVE, SUSPENDED, WITHDRAWN
    }
}
