package com.zipddak.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateCostDto {
    private Integer costIdx;
    private Integer estimateIdx;
    private String type;
    private String label;
    private Integer amount;
}
