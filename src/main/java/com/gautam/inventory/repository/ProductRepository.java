package com.gautam.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gautam.inventory.entity.Product;

import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM Product p")
    Integer getTotalStock();

    long countByQuantityLessThan(Integer quantity);

}