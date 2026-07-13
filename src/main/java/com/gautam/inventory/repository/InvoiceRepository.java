package com.gautam.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gautam.inventory.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    boolean existsBySaleId(Long saleId);

}
