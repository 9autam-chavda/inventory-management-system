package com.gautam.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gautam.inventory.entity.Purchase;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

}