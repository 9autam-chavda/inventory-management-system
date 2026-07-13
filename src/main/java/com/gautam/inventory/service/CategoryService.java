package com.gautam.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gautam.inventory.dto.CreateCategoryRequest;
import com.gautam.inventory.dto.UpdateCategoryRequest;
import com.gautam.inventory.entity.Category;
import com.gautam.inventory.exception.BadRequestException;
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

        String name = request.getName().trim();

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new BadRequestException("Category already exists with name: " + name);
        }

        Category category = Category.builder()
                .name(name)
                .description(cleanOptionalText(request.getDescription()))
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

        String name = request.getName().trim();

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {

            throw new BadRequestException(
                    "Category already exists with name: " + name);
        }

        category.setName(name);
        category.setDescription(cleanOptionalText(request.getDescription()));

        return categoryRepository.save(category);
    }

    // Delete Category
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));

        categoryRepository.delete(category);
    }

    private String cleanOptionalText(String value) {
        return value == null ? null : value.trim();
    }

}
