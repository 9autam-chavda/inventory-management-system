package com.gautam.inventory.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.gautam.inventory.dto.InvoiceResponse;
import com.gautam.inventory.entity.Invoice;
import com.gautam.inventory.entity.Sale;
import com.gautam.inventory.exception.ResourceNotFoundException;
import com.gautam.inventory.repository.InvoiceRepository;
import com.gautam.inventory.repository.SaleRepository;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final SaleRepository saleRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          SaleRepository saleRepository) {
        this.invoiceRepository = invoiceRepository;
        this.saleRepository = saleRepository;
    }

    // Generate Invoice
    public InvoiceResponse generateInvoice(Long saleId) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sale not found with id: " + saleId));

        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setInvoiceDate(LocalDate.now());

        BigDecimal totalAmount = sale.getSellingPrice()
                .multiply(BigDecimal.valueOf(sale.getQuantity()));

        invoice.setTotalAmount(totalAmount);
        invoice.setSale(sale);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        return mapToResponse(savedInvoice);
    }

    // Get Invoice By Id
    public InvoiceResponse getInvoiceById(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with id: " + id));

        return mapToResponse(invoice);
    }

    // Get All Invoices
    public java.util.List<InvoiceResponse> getAllInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Delete Invoice
    public void deleteInvoice(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with id: " + id));

        invoiceRepository.delete(invoice);
    }

    private String generateInvoiceNumber() {
        return "INV-" + System.currentTimeMillis();
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {

        InvoiceResponse response = new InvoiceResponse();

        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setInvoiceDate(invoice.getInvoiceDate());

        response.setCustomerName(invoice.getSale().getCustomerName());
        response.setProductName(invoice.getSale().getProduct().getName());

        response.setQuantity(invoice.getSale().getQuantity());
        response.setSellingPrice(invoice.getSale().getSellingPrice());

        response.setTotalAmount(invoice.getTotalAmount());

        return response;
    }
}