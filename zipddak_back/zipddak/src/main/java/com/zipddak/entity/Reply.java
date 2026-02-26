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
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer replyIdx;

    @Column(columnDefinition = "TEXT")
    private String context;

    @Column
    private String writer; // user.username

    @Column
    private Integer communityIdx;

    @CreationTimestamp
    private Date createdate;
}
