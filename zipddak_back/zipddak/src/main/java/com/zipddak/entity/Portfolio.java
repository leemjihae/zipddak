package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer portfolioIdx;

    @Column(nullable = false)
    private Integer expertIdx;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer serviceIdx;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private Integer price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkTimeType workTimeType;  // ENUM(HOUR, DAY, WEEK, MONTH)

    @Column(nullable = false)
    private Integer workTimeValue;

    @Column(nullable = false)
    private Integer image1Idx;

    @Column
    private Integer image2Idx;

    @Column
    private Integer image3Idx;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private Date createdAt;

    public enum WorkTimeType {
        HOUR, DAY, WEEK, MONTH
    }
}
