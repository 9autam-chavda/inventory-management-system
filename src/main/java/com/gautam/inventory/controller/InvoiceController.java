package com.gautam.inventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.gautam.inventory.dto.InvoiceResponse;
import com.gautam.inventory.service.InvoiceService;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // Generate Invoice from Sale
    @PostMapping("/generate/{saleId}")
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse generateInvoice(@PathVariable Long saleId) {
        return invoiceService.generateInvoice(saleId);
    }

    // Get All Invoices
    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    // Get Invoice By Id
    @GetMapping("/{id}")
    public InvoiceResponse getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id);
    }

    // Delete Invoice
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
    }
}