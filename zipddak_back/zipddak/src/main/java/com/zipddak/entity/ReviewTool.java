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
public class ReviewTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewToolIdx;

    @Column(nullable = false)
    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    private Date createdate;

    @Column
    private String writer; 

    @Column
    private Integer toolIdx;

    @Column
    private Integer rentalIdx;

    @Column
    private Integer img1;

    @Column
    private Integer img2;

    @Column
    private Integer img3;
}
