import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { getProductImage } from '../../shared/utils/images';
import { get } from 'http';
import { ProductsService } from '../../core/services/products.service';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  photo: string;
  tags: string[];
  description?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

interface Tag {
  id: string;
  name: string;
  productCount: number;
}

interface Activity {
  id: string;
  type: 'product' | 'category' | 'tag' | 'stock';
  description: string;
  user: string;
  time: Date;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export default class AdminPanelComponent implements OnInit {
  // Sidebar
  sidebarCollapsed: boolean = false;
  activeSection: string = 'dashboard';

  // Dashboard stats
  totalProducts: number = 0;
  outOfStockProducts: number = 0;
  totalCategories: number = 0;
  totalTags: number = 0;

  // Products
  products: Product[] = [];
  outOfStockProductsList: Product[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  // Categories
  categories: Category[] = [];

  // Tags
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  tagSearchTerm: string = '';

  // Activity log
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  recentActivities: Activity[] = [];
  activityTypeFilter: string = 'all';
  activityStartDate: string = '';
  activityEndDate: string = '';
  activityCurrentPage: number = 1;
  activityTotalPages: number = 1;

  // Modals
  showAddProductModal: boolean = false;
  showAddStockModal: boolean = false;
  showAddCategoryModal: boolean = false;
  showAddTagModal: boolean = false;

  // Forms
  productForm: FormGroup;
  stockForm: FormGroup;
  categoryForm: FormGroup;
  tagForm: FormGroup;

  // Editing states
  editingProduct: boolean = false;
  editingCategory: boolean = false;
  editingTag: boolean = false;
  selectedProduct: Product | null = null;
  selectedCategory: Category | null = null;
  selectedTag: Tag | null = null;

  // Tags input
  tagInput: string = '';
  selectedTags: Tag[] = [];

  // Image upload
  imagePreview: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private productsService: ProductsService
  ) {
    // Initialize forms
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
    });

    this.stockForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: [''],
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    this.tagForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.filterTags();
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'products':
        return 'Gestión de Productos';
      case 'categories':
        return 'Categorías';
      case 'tags':
        return 'Tags';
      case 'activity':
        return 'Registro de Actividades';
      default:
        return '';
    }
  }

  loadData(): void {
    // Load data from the server (mocked for now)
    console.log('Loading data...');
    this.adminService.getOverview().subscribe((data: any) => {
      console.log('Data loaded:', data);
      this.products = data.products;
      this.categories = data.categories;
      this.tags = data.tags;
      this.activities = data.activities;
      this.calculateStats();
      this.getImages();

      // Set recent activities
      this.recentActivities = this.activities.slice(0, 5);
      this.filteredActivities = [...this.activities];

      // Set out of stock products
      this.outOfStockProductsList = this.products.filter(
        (product) => product.stock === 0
      );
    });
  }

  getImages(): void {
    this.products.map(
      (product) => (product.photo = getProductImage(product.category))
    );
  }
  // Calculate dashboard stats
  calculateStats(): void {
    this.totalProducts = this.products.length;
    this.outOfStockProducts = this.products.filter(
      (product) => product.stock === 0
    ).length;
    this.totalCategories = this.categories.length;
    this.totalTags = this.tags.length;
  }

  // Activity log methods
  getActivityIcon(type: string): string {
    switch (type) {
      case 'product':
        return 'inventory_2';
      case 'category':
        return 'category';
      case 'tag':
        return 'sell';
      case 'stock':
        return 'inventory';
      case 'user':
        return 'person_add';
      default:
        return 'history';
    }
  }

  getActivityIconClass(type: string): string {
    return type;
  }

  getActivityTypeLabel(type: string): string {
    switch (type) {
      case 'product':
        return 'Producto';
      case 'category':
        return 'Categoría';
      case 'tag':
        return 'Tag';
      case 'stock':
        return 'Stock';
      default:
        return type;
    }
  }

  filterActivities(): void {
    this.filteredActivities = this.activities.filter((activity) => {
      // Filter by type
      const typeMatch =
        this.activityTypeFilter === 'all' ||
        activity.type === this.activityTypeFilter;

      // Filter by date range
      let dateMatch = true;
      if (this.activityStartDate) {
        const startDate = new Date(this.activityStartDate);
        dateMatch = dateMatch && activity.time >= startDate;
      }
      if (this.activityEndDate) {
        const endDate = new Date(this.activityEndDate);
        endDate.setHours(23, 59, 59);
        dateMatch = dateMatch && activity.time <= endDate;
      }

      return typeMatch && dateMatch;
    });
  }

  // Tags methods
  filterTags(): void {
    if (!this.tagSearchTerm) {
      this.filteredTags = [...this.tags];
      return;
    }

    this.filteredTags = this.tags.filter((tag) =>
      tag.name.toLowerCase().includes(this.tagSearchTerm.toLowerCase())
    );
  }

  getFilteredTagsForDropdown(): Tag[] {
    if (!this.tagInput) return [];

    const selectedTagIds = this.selectedTags.map((tag) => tag.id);
    return this.tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(this.tagInput.toLowerCase()) &&
        !selectedTagIds.includes(tag.id)
    );
  }

  tagExists(name: string): boolean {
    return this.tags.some(
      (tag) => tag.name.toLowerCase() === name.toLowerCase()
    );
  }

  addTag(tag: Tag): void {
    if (!this.selectedTags.some((t) => t.id === tag.id)) {
      this.selectedTags.push(tag);
    }
    this.tagInput = '';
  }

  removeTag(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter((t) => t.id !== tag.id);
  }

  createAndAddTag(name: string): void {
    const newTag: Tag = {
      id: `TAG${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      productCount: 0,
    };

    this.tags.push(newTag);
    this.addTag(newTag);
    this.filterTags();
  }

  // Modal methods
  openAddProductModal(): void {
    this.editingProduct = false;
    this.selectedProduct = null;
    this.selectedTags = [];
    this.imagePreview = null;
    this.productForm.reset({
      stock: 0,
    });
    this.showAddProductModal = true;
  }

  openAddStockModal(product: Product): void {
    this.selectedProduct = product;
    this.stockForm.reset({
      quantity: 1,
    });
    this.showAddStockModal = true;
  }

  openAddCategoryModal(): void {
    this.editingCategory = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.showAddCategoryModal = true;
  }

  openAddTagModal(): void {
    this.editingTag = false;
    this.selectedTag = null;
    this.tagForm.reset();
    this.showAddTagModal = true;
  }

  openAddTagToProductModal(product: Product): void {
    this.selectedProduct = product;
    // Implementation would go here
  }

  closeModal(): void {
    this.showAddProductModal = false;
    this.showAddStockModal = false;
    this.showAddCategoryModal = false;
    this.showAddTagModal = false;
  }

  // Form submission methods
  saveProduct(): void {
    if (this.productForm.invalid) return;

    const formData = this.productForm.value;

    if (this.editingProduct && this.selectedProduct) {
      // Update existing product
      const index = this.products.findIndex(
        (p) => p.id === this.selectedProduct!.id
      );
      if (index !== -1) {
        this.products[index] = {
          ...this.selectedProduct,
          name: formData.name,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          description: formData.description,
          tags: this.selectedTags.map((tag) => tag.name),
          photo: getProductImage(formData.category),
        };
        console.log(this.products[index]);
        this.productsService.updateProduct(this.products[index]).subscribe(() => {
          
          console.log('Product updated successfully');
        });
      }
    } else {
      // Add new product
      const newProduct: Product = {
        id: `PRD${Math.floor(Math.random() * 1000)}`,
        name: formData.name,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        description: formData.description,
        tags: this.selectedTags.map((tag) => tag.name),
        photo: getProductImage(formData.category),
      };
      this.products.unshift(newProduct);
    }

    // Update stats and lists
    this.calculateStats();
    this.outOfStockProductsList = this.products.filter(
      (product) => product.stock === 0
    );

    // Add activity
    const activityDescription = this.editingProduct
      ? `Producto "${formData.name}" editado`
      : `Producto "${formData.name}" añadido`;

    this.addActivity('product', activityDescription);

    // Close modal
    this.closeModal();
  }

  saveStock(): void {
    if (this.stockForm.invalid || !this.selectedProduct) return;

    const formData = this.stockForm.value;
    const quantity = formData.quantity;

    // Update product stock
    const index = this.products.findIndex(
      (p) => p.id === this.selectedProduct!.id
    );

    this.adminService
      .addStock(this.selectedProduct.id, quantity)
      .subscribe(() => {
        console.log('Stock added successfully!');
        if (index !== -1) {
          this.products[index].stock += quantity;

          this.calculateStats();

          this.outOfStockProductsList = this.products.filter(
            (product) => product.stock === 0
          );
        }
      });
    this.closeModal();
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;

    const formData = this.categoryForm.value;

    if (this.editingCategory && this.selectedCategory) {
      // Update existing category
      const index = this.categories.findIndex(
        (c) => c.id === this.selectedCategory!.id
      );
      if (index !== -1) {
        this.categories[index] = {
          ...this.selectedCategory,
          name: formData.name,
          description: formData.description,
        };
      }
    } else {
      // Add new category
      const newCategory: Category = {
        id: `CAT${Math.floor(Math.random() * 1000)}`,
        name: formData.name,
        description: formData.description,
        productCount: 0,
      };

      this.categories.push(newCategory);
    }

    // Update stats
    this.calculateStats();

    // Add activity
    const activityDescription = this.editingCategory
      ? `Categoría "${formData.name}" editada`
      : `Categoría "${formData.name}" añadida`;

    this.addActivity('category', activityDescription);

    // Close modal
    this.closeModal();
  }

  saveTag(): void {
    if (this.tagForm.invalid) return;

    const formData = this.tagForm.value;

    if (this.editingTag && this.selectedTag) {
      // Update existing tag
      const index = this.tags.findIndex((t) => t.id === this.selectedTag!.id);
      if (index !== -1) {
        this.tags[index] = {
          ...this.selectedTag,
          name: formData.name,
        };
      }
    } else {
      // Add new tag
      const newTag: Tag = {
        id: `TAG${Math.floor(Math.random() * 1000)}`,
        name: formData.name,
        productCount: 0,
      };

      this.tags.push(newTag);
    }

    // Update stats and filtered tags
    this.calculateStats();
    this.filterTags();

    // Add activity
    const activityDescription = this.editingTag
      ? `Tag "${formData.name}" editado`
      : `Tag "${formData.name}" añadido`;

    this.addActivity('tag', activityDescription);

    // Close modal
    this.closeModal();
  }

  // Edit methods
  editProduct(product: Product): void {
    this.editingProduct = true;
    this.selectedProduct = product;
    this.imagePreview = product.photo;

    // Set selected tags
    this.selectedTags = product.tags.map((tagName) => {
      const tag = this.tags.find((t) => t.name === tagName);
      return (
        tag || {
          id: `TAG${Math.floor(Math.random() * 1000)}`,
          name: tagName,
          productCount: 1,
        }
      );
    });

    // Set form values
    this.productForm.setValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description || '',
    });

    this.showAddProductModal = true;
  }

  editCategory(category: Category): void {
    this.editingCategory = true;
    this.selectedCategory = category;

    // Set form values
    this.categoryForm.setValue({
      name: category.name,
      description: category.description,
    });

    this.showAddCategoryModal = true;
  }

  editTag(tag: Tag): void {
    this.editingTag = true;
    this.selectedTag = tag;

    // Set form values
    this.tagForm.setValue({
      name: tag.name,
    });

    this.showAddTagModal = true;
  }

  // Delete methods
  deleteProduct(product: Product): void {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`
      )
    ) {
      this.products = this.products.filter((p) => p.id !== product.id);

      // Update stats and lists
      this.calculateStats();
      this.outOfStockProductsList = this.products.filter(
        (product) => product.stock === 0
      );

      // Add activity
      this.addActivity('product', `Producto "${product.name}" eliminado`);
    }
  }

  deleteCategory(category: Category): void {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`
      )
    ) {
      this.categories = this.categories.filter((c) => c.id !== category.id);

      // Update stats
      this.calculateStats();

      // Add activity
      this.addActivity('category', `Categoría "${category.name}" eliminada`);
    }
  }

  deleteTag(tag: Tag): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el tag "${tag.name}"?`)) {
      this.tags = this.tags.filter((t) => t.id !== tag.id);

      // Update stats and filtered tags
      this.calculateStats();
      this.filterTags();

      // Add activity
      this.addActivity('tag', `Tag "${tag.name}" eliminado`);
    }
  }

  // Activity log
  addActivity(
    type: 'product' | 'category' | 'tag' | 'stock',
    description: string
  ): void {
    const newActivity: Activity = {
      id: `ACT${Math.floor(Math.random() * 1000)}`,
      type: type,
      description: description,
      user: 'Admin',
      time: new Date(),
    };

    this.activities.unshift(newActivity);
    this.recentActivities = this.activities.slice(0, 5);
    this.filteredActivities = [...this.activities];
  }

  // Image upload
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }
}
