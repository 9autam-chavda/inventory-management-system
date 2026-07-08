package com.gautam.inventory.service;

import org.springframework.stereotype.Service;

import com.gautam.inventory.dto.DashboardResponse;
import com.gautam.inventory.repository.CategoryRepository;
import com.gautam.inventory.repository.InvoiceRepository;
import com.gautam.inventory.repository.ProductRepository;
import com.gautam.inventory.repository.PurchaseRepository;
import com.gautam.inventory.repository.SaleRepository;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PurchaseRepository purchaseRepository;
    private final SaleRepository saleRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            PurchaseRepository purchaseRepository,
            SaleRepository saleRepository,
            InvoiceRepository invoiceRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.purchaseRepository = purchaseRepository;
        this.saleRepository = saleRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public DashboardResponse getDashboardData() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalProducts(productRepository.count());

        response.setTotalCategories(categoryRepository.count());

        response.setTotalPurchases(purchaseRepository.count());

        response.setTotalSales(saleRepository.count());

        response.setTotalInvoices(invoiceRepository.count());

        response.setTotalStock(productRepository.getTotalStock());

        response.setLowStockProducts(
                productRepository.countByQuantityLessThan(10)
        );

        return response;
    }
}