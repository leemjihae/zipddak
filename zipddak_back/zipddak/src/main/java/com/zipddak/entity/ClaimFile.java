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
public class ClaimFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer claimFileIdx;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, unique = true)
    private String fileRename;

    @Column(nullable = false)
    private String storagePath;

    @CreationTimestamp
    private Date createdAt;
}
