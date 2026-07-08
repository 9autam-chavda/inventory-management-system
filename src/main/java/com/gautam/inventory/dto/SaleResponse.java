package com.gautam.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleResponse {

    private Long id;
    private String customerName;
    private String productName;
    private Integer quantity;
    private BigDecimal sellingPrice;
    private LocalDate saleDate;

    public SaleResponse() {
    }

    // Generate Getters and Setters
}