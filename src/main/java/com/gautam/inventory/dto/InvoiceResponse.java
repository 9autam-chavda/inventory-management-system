package com.gautam.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceResponse {

    private Long id;
    private String invoiceNumber;
    private String customerName;
    private String productName;
    private Integer quantity;
    private BigDecimal sellingPrice;
    private BigDecimal totalAmount;
    private LocalDate invoiceDate;

    public InvoiceResponse() {
    }

    // Generate Getters and Setters
}