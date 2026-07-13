package com.gautam.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gautam.inventory.dto.CreatePurchaseRequest;
import com.gautam.inventory.dto.PurchaseResponse;
import com.gautam.inventory.dto.UpdatePurchaseRequest;
import com.gautam.inventory.entity.Product;
import com.gautam.inventory.entity.Purchase;
import com.gautam.inventory.exception.BadRequestException;
import com.gautam.inventory.exception.ResourceNotFoundException;
import com.gautam.inventory.repository.ProductRepository;
import com.gautam.inventory.repository.PurchaseRepository;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           ProductRepository productRepository) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
    }

    // Create Purchase
    @Transactional
    public PurchaseResponse createPurchase(CreatePurchaseRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Increase stock
        product.setQuantity(product.getQuantity() + request.getQuantity());

        Purchase purchase = new Purchase();
        purchase.setSupplierName(request.getSupplierName().trim());
        purchase.setQuantity(request.getQuantity());
        purchase.setPurchasePrice(request.getPurchasePrice());
        purchase.setPurchaseDate(request.getPurchaseDate());
        purchase.setProduct(product);

        Purchase savedPurchase = purchaseRepository.save(purchase);

        productRepository.save(product);

        return mapToResponse(savedPurchase);
    }

    // Get All Purchases
    public List<PurchaseResponse> getAllPurchases() {

        return purchaseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Purchase By Id
    public PurchaseResponse getPurchaseById(Long id) {

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Purchase not found with id: " + id));

        return mapToResponse(purchase);
    }

    // Update Purchase
    @Transactional
    public PurchaseResponse updatePurchase(Long id, UpdatePurchaseRequest request) {

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Purchase not found with id: " + id));

        Product oldProduct = purchase.getProduct();

        if (oldProduct.getQuantity() < purchase.getQuantity()) {
            throw new BadRequestException("Purchase cannot be reduced because stock from this purchase has already been sold");
        }

        // Remove old quantity from old product
        oldProduct.setQuantity(oldProduct.getQuantity() - purchase.getQuantity());

        Product newProduct = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Add new quantity to new product
        newProduct.setQuantity(newProduct.getQuantity() + request.getQuantity());

        purchase.setSupplierName(request.getSupplierName().trim());
        purchase.setQuantity(request.getQuantity());
        purchase.setPurchasePrice(request.getPurchasePrice());
        purchase.setPurchaseDate(request.getPurchaseDate());
        purchase.setProduct(newProduct);

        productRepository.save(oldProduct);
        productRepository.save(newProduct);

        Purchase updatedPurchase = purchaseRepository.save(purchase);

        return mapToResponse(updatedPurchase);
    }

    // Delete Purchase
    @Transactional
    public void deletePurchase(Long id) {

        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Purchase not found with id: " + id));

        Product product = purchase.getProduct();

        if (product.getQuantity() < purchase.getQuantity()) {
            throw new BadRequestException("Purchase cannot be deleted because stock from this purchase has already been sold");
        }

        // Reduce stock
        product.setQuantity(product.getQuantity() - purchase.getQuantity());

        productRepository.save(product);

        purchaseRepository.delete(purchase);
    }

    // DTO Mapper
    private PurchaseResponse mapToResponse(Purchase purchase) {

        PurchaseResponse response = new PurchaseResponse();

        response.setId(purchase.getId());
        response.setSupplierName(purchase.getSupplierName());
        response.setProductId(purchase.getProduct().getId());
        response.setProductName(purchase.getProduct().getName());
        response.setQuantity(purchase.getQuantity());
        response.setPurchasePrice(purchase.getPurchasePrice());
        response.setPurchaseDate(purchase.getPurchaseDate());

        return response;
    }
}
