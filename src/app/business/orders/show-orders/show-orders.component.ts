import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../core/services/orders.service';
interface OrderItem {
  quantity: number;
}

interface PaymentDetail {
  state: string;
  provider: string;
}

interface Order {
  shipping_method: string;
  date: string;
  time: string;
  total_price: string;
  payment_detail: PaymentDetail;
  items: OrderItem[];
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.css'],
})
export default class OrdersHistoryComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  paymentStateFilter: string = 'all';

  // Mapeo de IDs de métodos de envío a nombres legibles
  shippingMethods: { [key: string]: string } = {
    'c6fe7758-ad4b-471b-83ac-1512008d446e': 'Envío en el día',
    '3fa05759-0698-4dd4-9626-03f0c394fcc3': 'Envío estándar',
    'a9439d3a-fd80-472d-8a67-31078ef48580': 'Retiro en tienda',
    '7cedfa3f-7396-4716-9271-9284de3b4281': 'Envío express',
  };

  // Imágenes de productos de ejemplo
  productImages: string[] = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzc1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MDA3NDZ8&ixlib=rb-4.0.3&q=80&w=1080',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzc1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MDA3NDZ8&ixlib=rb-4.0.3&q=80&w=1080',
    'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzc1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MDA3NDZ8&ixlib=rb-4.0.3&q=80&w=1080',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzc1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MDA3NDZ8&ixlib=rb-4.0.3&q=80&w=1080',
    'https://images.unsplash.com/photo-1551074659-f12c57f205b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzc1Nzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDQ2MDA3NDZ8&ixlib=rb-4.0.3&q=80&w=1080',
  ];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    // En una aplicación real, obtendrías las órdenes de un servicio
    // this.orderService.getCustomerOrders().subscribe(orders => {
    //   this.orders = orders;
    //   this.filteredOrders = orders;
    // });

    // Para este ejemplo, usamos los datos proporcionados
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe((response: any) => {
      this.orders = response;
      this.filteredOrders = [...this.orders];
    });
    
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter((order) => {
      // Filtrar por término de búsqueda (ID generado)
      const orderId = this.generateOrderId(order).toLowerCase();
      const searchMatch =
        this.searchTerm === '' ||
        orderId.includes(this.searchTerm.toLowerCase());

      // Filtrar por estado de pago
      const stateMatch =
        this.paymentStateFilter === 'all' ||
        order.payment_detail.state === this.paymentStateFilter;

      return searchMatch && stateMatch;
    });
  }

  getStatusClass(state: string): string {
    switch (state) {
      case 'pendiente':
        return 'status-pending';
      case 'completado':
        return 'status-completed';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusLabel(state: string): string {
    switch (state) {
      case 'pendiente':
        return 'Pendiente de pago';
      case 'completado':
        return 'Pago completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return state;
    }
  }

  getShippingMethodName(methodId: string): string {
    return this.shippingMethods[methodId] || 'Método de envío desconocido';
  }

  // Genera un ID de orden basado en la fecha y hora
  generateOrderId(order: Order): string {
    const date = order.date.replace(/-/g, '');
    const time = order.time.substring(0, 8).replace(/:/g, '');
    return `ORD-${date}-${time}`;
  }

  // Obtiene una imagen de producto de ejemplo
  getProductImage(index: number): string {
    return this.productImages[index % this.productImages.length];
  }

  // Calcula un precio aproximado para cada ítem basado en el total
  calculateItemPrice(order: Order, itemIndex: number): string {
    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = parseFloat(order.total_price);
    const itemQuantity = order.items[itemIndex].quantity;

    // Precio por unidad (aproximado)
    const unitPrice = totalPrice / totalItems;

    // Precio total del ítem
    const itemPrice = (unitPrice * itemQuantity).toFixed(2);

    return itemPrice;
  }
}
