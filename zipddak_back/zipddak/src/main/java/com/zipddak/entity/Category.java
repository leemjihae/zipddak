package com.zipddak.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.CategoryDto;

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
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryIdx;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer depth;

    @Column
    private Integer parentIdx;
    //매니투원 관계안맺으면 데이터타입 일반으로 (포린키를 할수 없음)
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;
    
    
    public enum CategoryType {
        product, expert, community, tool
    }
    
    
    public CategoryDto toDto() {
    	
    	return CategoryDto.builder()
    			.categoryIdx(categoryIdx)
    			.name(name)
    			.depth(depth)
    			.parentIdx(parentIdx)
    			.type(name)
    			.build();
    	
    }
    
    
}
