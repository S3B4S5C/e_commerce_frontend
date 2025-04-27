import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../../environments/environments';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { CartService } from '../../core/services/cart.service';
declare var Stripe: any;

interface Tag {
  id: string;
  name: string;
}

interface Preview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  id: string;
  tags: Tag[];
  previews: Preview[];
  total_stock: number;
  name: string;
  price: string;
  specification: string;
  category: string;
  photo: string;
  brand: string;
  created_at: string;
  modified_at: string;
  deleted_at: null | string;
  quantity: number;
}

interface ShippingMethod {
  id: string;
  name: string;
  cost: string;
  estimated_time: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-checkout',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export default class CheckoutComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  products: Product[] = [];
  shippingMethods: ShippingMethod[] = [];
  selectedShippingMethod: ShippingMethod = { cost: '0' } as ShippingMethod;
  cardholderName: string = '';
  saveCard: boolean = false;
  isProcessing: boolean = false;

  // Stripe related properties
  stripe: any;
  elements: any;
  card: any;
  clientSecret: string = '';

  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private cartService: CartService // private cartService: CartService // private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeStripe();
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.card) {
      this.card.destroy();
    }
  }

  loadMockData(): void {
    // Mock products data

    this.cartService.getCart().subscribe((data: any) => {
      this.products = data.products;
    });
    // Mock shipping methods data
    this.shippingMethods = [
      {
        id: 'c6fe7758-ad4b-471b-83ac-1512008d446e',
        name: 'En el día',
        cost: '71.83',
        estimated_time: '8 00:00:00',
      },
      {
        id: '7cedfa3f-7396-4716-9271-9284de3b4281',
        name: 'Rápido',
        cost: '87.67',
        estimated_time: '11:38:00',
      },
      {
        id: '3fa05759-0698-4dd4-9626-03f0c394fcc3',
        name: 'Envío estándar',
        cost: '11.56',
        estimated_time: '8 00:00:00',
      },
      {
        id: 'a9439d3a-fd80-472d-8a67-31078ef48580',
        name: 'Retiro en tienda',
        cost: '46.42',
        estimated_time: '08:57:00',
      },
    ];
  }

  async initializeStripe(): Promise<void> {
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    if (!stripe) {
      console.error('Stripe no se pudo inicializar');
      return;
    }

    this.stripe = stripe;
    this.elements = this.stripe.elements();

    this.card = this.elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    });

    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (displayError) {
        displayError.textContent = event.error ? event.error.message : '';
      }
    });
  }

  formatEstimatedTime(timeString: string): string {
    if (timeString.includes(' ')) {
      const parts = timeString.split(' ');
      return `${parts[0]} días`;
    } else {
      const timeParts = timeString.split(':');
      return `${timeParts[0]}h ${timeParts[1]}min`;
    }
  }

  updateTotals(): void {
  }

  calculateSubtotal(): number {
    return this.products.reduce((total, product) => {
      return total + parseFloat(product.price) * product.quantity;
    }, 0);
  }

  calculateTaxes(): number {
    return this.calculateSubtotal() * 0.1;
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const taxes = this.calculateTaxes();
    const shipping = this.selectedShippingMethod
      ? parseFloat(this.selectedShippingMethod.cost)
      : 0;

    return subtotal + taxes + shipping;
  }

  async processPayment(): Promise<void> {
    if (!this.selectedShippingMethod) {
      return;
    }

    this.isProcessing = true;

    try {
      await this.createPaymentIntentAndConfirm();
    } catch (error) {
      console.error('Error processing payment:', error);
      const errorElement = document.getElementById('card-errors');
      if (errorElement) {
        errorElement.textContent =
          'Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.';
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async confirmPaymentWithExistingSecret(): Promise<void> {
    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: this.cardholderName,
        },
      },
    });

    if (result.error) {
      const errorElement = document.getElementById('card-errors');
      if (errorElement) {
        errorElement.textContent = result.error.message;
      }
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        this.handleSuccessfulPayment(result.paymentIntent);
      }
    }
  }

  async createPaymentIntentAndConfirm(): Promise<void> {
    const response = this.ordersService
      .createPaymentIntent(this.selectedShippingMethod.id)
      .subscribe((response: any) => {
        this.clientSecret = response.client_secret;
        this.confirmPaymentWithExistingSecret();
      });
  }

  handleSuccessfulPayment(paymentIntent: any): void {
    // In a real app, you would:
    // 1. Call your backend to create an order
    // 2. Clear the cart
    // 3. Redirect to a success page

    // For demo purposes, just redirect
    this.router.navigate(['/order-success'], {
      queryParams: {
        order_id: 'mock-order-id',
        payment_id: paymentIntent.id,
      },
    });
  }

  getPrice(product: Product): string {
    return (parseFloat(product.price) * product.quantity).toFixed(2);
  }
}
