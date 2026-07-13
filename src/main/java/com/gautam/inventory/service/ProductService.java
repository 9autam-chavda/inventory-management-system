package com.gautam.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gautam.inventory.dto.CreateProductRequest;
import com.gautam.inventory.dto.ProductResponse;
import com.gautam.inventory.dto.UpdateProductRequest;
import com.gautam.inventory.entity.Category;
import com.gautam.inventory.entity.Product;
import com.gautam.inventory.exception.BadRequestException;
import com.gautam.inventory.exception.ResourceNotFoundException;
import com.gautam.inventory.repository.CategoryRepository;
import com.gautam.inventory.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // Create Product
    public ProductResponse createProduct(CreateProductRequest request) {

        String name = request.getName().trim();

        if (productRepository.existsByNameIgnoreCase(name)) {
            throw new BadRequestException("Product already exists with name: " + name);
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(name)
                .description(cleanOptionalText(request.getDescription()))
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    // Get All Products
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Product By Id
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        return mapToResponse(product);
    }

    // Update Product
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        String name = request.getName().trim();

        if (productRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new BadRequestException("Product already exists with name: " + name);
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        product.setName(name);
        product.setDescription(cleanOptionalText(request.getDescription()));
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    // Delete Product
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        productRepository.delete(product);
    }

    // Convert Entity -> Response DTO
    private ProductResponse mapToResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private String cleanOptionalText(String value) {
        return value == null ? null : value.trim();
    }
}
