package com.gautam.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gautam.inventory.dto.CreateCategoryRequest;
import com.gautam.inventory.dto.UpdateCategoryRequest;
import com.gautam.inventory.entity.Category;
import com.gautam.inventory.exception.ResourceNotFoundException;
import com.gautam.inventory.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Create Category
    public Category createCategory(CreateCategoryRequest request) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists with name: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return categoryRepository.save(category);
    }

    // Get All Categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get Category By ID
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));
    }

    // Update Category
    public Category updateCategory(Long id, UpdateCategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getName().equals(request.getName())
                && categoryRepository.existsByName(request.getName())) {

            throw new RuntimeException(
                    "Category already exists with name: " + request.getName());
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return categoryRepository.save(category);
    }

    // Delete Category
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));

        categoryRepository.delete(category);
    }

}