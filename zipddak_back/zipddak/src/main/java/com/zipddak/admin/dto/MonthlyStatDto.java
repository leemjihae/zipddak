package com.zipddak.admin.dto;

import java.time.YearMonth;

import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;

import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStatDto {
    private YearMonth month; // 2024-12
    private Long value;      // 매출 or 건수
}
