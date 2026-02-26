package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.ProductOptionDto;

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
public class ProductOption {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer productOptionIdx;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "productIdx")
	private Product product;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String value;

	@Column
	private Long price;

	@CreationTimestamp
	private Date createdAt;

	@UpdateTimestamp
	private Date updatedAt;

	public ProductOptionDto toDto() {
		return ProductOptionDto.builder().productOptionIdx(productOptionIdx).productIdx(product.getProductIdx())
				.productName(product.getName()).name(name).value(value).price(price).createdAt(createdAt)
				.updatedAt(updatedAt).build();
	}
    
    public ProductOptionDto toProductOptionDto() {
    	return ProductOptionDto.builder()
    			.productOptionIdx(productOptionIdx)
    			.name(name)
    			.value(value)
    			.price(price)
    			.createdAt(createdAt)
    			.updatedAt(updatedAt)
    			.productIdx(product.getProductIdx())
    			.productName(product.getName())
    			.build();
    }
}
