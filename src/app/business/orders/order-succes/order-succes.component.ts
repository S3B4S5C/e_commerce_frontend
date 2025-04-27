import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-succes',
  imports: [],
  templateUrl: './order-succes.component.html',
  styleUrl: './order-succes.component.css'
})
export default class OrderSuccesComponent implements OnInit {
  orderId: string = '';
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Get order ID from route parameters
    this.route.queryParams.subscribe(params => {
      this.orderId = params['order_id'] || this.generateOrderId();
    });
  }
  
  // Generate a random order ID for demo purposes
  private generateOrderId(): string {
    const prefix = 'ORD';
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
}