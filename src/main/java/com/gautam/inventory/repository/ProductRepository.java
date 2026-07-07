package com.gautam.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gautam.inventory.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}