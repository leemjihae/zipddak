package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;
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
public class Estimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer estimateIdx;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "expertIdx")
    private Expert expert;

    @Column(nullable = false)
    private Integer requestIdx;

    @Column(nullable = false)
    private Integer largeServiceIdx;
    
    @Column
    private String diagnosisType; // 'VISIT', 'PHOTO'
    
    @Column
    private String repairType; // 'PART', 'ALL', 'CHECK'
    
    @Column
    private String demolitionType; // 'INCLUDED', 'EXTRA', 'NONE'

    @Column
    private String consultingType; // 'ONLINE', 'VISIT'
    
    @Enumerated(EnumType.STRING)
    private WorkDurationType workDurationType;  // HOUR, DAY, WEEK, MONTH

    @Column
    private Integer workDurationValue;

    @Column(nullable = false)
    private String workScope; // 콤마 구분 문자열

    @Column(columnDefinition = "TEXT")
    private String workDetail;

    @Column
    private Integer disposalCost;

    @Column
    private Integer demolitionCost;

    @Column
    private Integer consultingLaborCost;

    @Column
    private Integer stylingDesignCost;

    @Column
    private Integer threeDImageCost;

    @Column
    private Integer reportProductionCost;

    @Column
    private Integer etcFee;
    
    @Column(columnDefinition = "TEXT")
    private String costDetail;

    @CreationTimestamp
    private Date createdAt;

    public enum WorkDurationType {
        HOUR, DAY, WEEK, MONTH
    }
}
