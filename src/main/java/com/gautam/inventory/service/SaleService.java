package com.gautam.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gautam.inventory.dto.CreateSaleRequest;
import com.gautam.inventory.dto.SaleResponse;
import com.gautam.inventory.dto.UpdateSaleRequest;
import com.gautam.inventory.entity.Product;
import com.gautam.inventory.entity.Sale;
import com.gautam.inventory.exception.ResourceNotFoundException;
import com.gautam.inventory.repository.ProductRepository;
import com.gautam.inventory.repository.SaleRepository;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

    public SaleService(SaleRepository saleRepository,
                       ProductRepository productRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public SaleResponse createSale(CreateSaleRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock available");
        }

        product.setQuantity(product.getQuantity() - request.getQuantity());

        Sale sale = new Sale();
        sale.setCustomerName(request.getCustomerName());
        sale.setQuantity(request.getQuantity());
        sale.setSellingPrice(request.getSellingPrice());
        sale.setSaleDate(request.getSaleDate());
        sale.setProduct(product);

        Sale savedSale = saleRepository.save(sale);

        productRepository.save(product);

        return mapToResponse(savedSale);
    }

    public List<SaleResponse> getAllSales() {
        return saleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SaleResponse getSaleById(Long id) {

        Sale sale = saleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sale not found with id: " + id));

        return mapToResponse(sale);
    }

    @Transactional
    public SaleResponse updateSale(Long id, UpdateSaleRequest request) {

        Sale sale = saleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sale not found with id: " + id));

        Product oldProduct = sale.getProduct();

        oldProduct.setQuantity(oldProduct.getQuantity() + sale.getQuantity());

        Product newProduct = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (newProduct.getQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock available");
        }

        newProduct.setQuantity(newProduct.getQuantity() - request.getQuantity());

        sale.setCustomerName(request.getCustomerName());
        sale.setQuantity(request.getQuantity());
        sale.setSellingPrice(request.getSellingPrice());
        sale.setSaleDate(request.getSaleDate());
        sale.setProduct(newProduct);

        productRepository.save(oldProduct);
        productRepository.save(newProduct);

        return mapToResponse(saleRepository.save(sale));
    }

    @Transactional
    public void deleteSale(Long id) {

        Sale sale = saleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sale not found with id: " + id));

        Product product = sale.getProduct();

        product.setQuantity(product.getQuantity() + sale.getQuantity());

        productRepository.save(product);

        saleRepository.delete(sale);
    }

    private SaleResponse mapToResponse(Sale sale) {

        SaleResponse response = new SaleResponse();

        response.setId(sale.getId());
        response.setCustomerName(sale.getCustomerName());
        response.setProductName(sale.getProduct().getName());
        response.setQuantity(sale.getQuantity());
        response.setSellingPrice(sale.getSellingPrice());
        response.setSaleDate(sale.getSaleDate());

        return response;
    }
}