package com.zipddak.entity;

import java.sql.Date;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class ReportReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportIdx;

    @CreationTimestamp
    private Date reportedAt;

    @Column(nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportState state;

    @Column(nullable = false)
    private String userUsername;

    @Column(nullable = false)
    private Integer reviewIdx;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewTarget reviewTarget; // TOOL, PRODUCT, EXPERT

    public enum ReportState {
        RECEIVED, COMPLETED, REJECTED
    }

    public enum ReviewTarget {
        TOOL, PRODUCT, EXPERT
    }
}
