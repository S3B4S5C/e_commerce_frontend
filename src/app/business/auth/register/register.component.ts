import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  name: string = '';
  cellphone: string = '';
  birthdate: string = '';
  gender: string = 'Male'; // M o F por defecto

  constructor(private authService: AuthService, private router: Router) { 
    console.log('RegisterComponent cargado');
  }

  register(event: Event): void {
    event.preventDefault(); // evita recargar la página
    if (this.password !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }
    this.authService.register(this.email, this.password, this.name, this.cellphone, this.birthdate, this.gender).subscribe(
      (response) => {
        console.log('Registro exitoso', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error en el registro', error);
      }
    );
  }
}
