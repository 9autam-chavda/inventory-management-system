package com.gautam.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gautam.inventory.entity.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {

}