package com.gautam.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer quantity;

    private Long categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}