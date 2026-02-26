package com.zipddak.seller.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompletedResponseDto {
	
	 private boolean success;
	 private LocalDateTime pickupCompletedAt;

}
