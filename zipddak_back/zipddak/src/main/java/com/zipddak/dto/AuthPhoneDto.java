package com.zipddak.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthPhoneDto {
    private Integer num;
    private String phone;
    private String authNum;
}
