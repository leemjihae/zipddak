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
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer communityIdx;

    @Column
    private Integer category;

    @Column
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    private Date createdate;

    @Column
    private Integer views;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username")
    private User user;

    @Column
    private Integer img1;

    @Column
    private Integer img2;

    @Column
    private Integer img3;

    @Column
    private Integer img4;

    @Column
    private Integer img5;
}
