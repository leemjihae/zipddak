package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.DynamicInsert;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Cancel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cancelIdx;

    @Column(nullable = false)
    private Integer paymentIdx;

    @Column(nullable = false)
    private Integer cancelAmount;

    @Column
    private String cancelReason;

    @Column
    private Integer refundableAmount;

    @Column
    private Integer cardDiscountAmount;

    @Column
    private Integer easyPayDiscountAmount;

    @Column
    private Date canceledAt;

    @Column
    private String transactionKey;

    @Column
    private String cancelStatus;
}
