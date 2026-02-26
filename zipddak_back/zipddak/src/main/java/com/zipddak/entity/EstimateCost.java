package com.zipddak.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.DynamicInsert;

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
public class EstimateCost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer costIdx;

    @Column(nullable = false)
    private Integer estimateIdx;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CostType type; // BUILD, MATERIAL

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private Integer amount;

    public enum CostType {
        BUILD, MATERIAL
    }
}
