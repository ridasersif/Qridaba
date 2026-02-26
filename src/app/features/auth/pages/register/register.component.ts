import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { RoleService, RoleResponse } from '../../../../core/services/role.service';
import { RegisterRequest } from '../../../../core/models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  serverErrors = signal<Record<string, string>>({});
  showPassword = signal<boolean>(false);
  roles = signal<RoleResponse[]>([]); // To store assignable roles

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: ['', [Validators.required]] // Mandatory select
  });

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAssignableRoles().subscribe({
      next: (data) => this.roles.set(data),
      error: (err) => console.error('Error fetching roles', err)
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.serverErrors.set({});

      const request: RegisterRequest = this.registerForm.value as RegisterRequest;

      this.authService.register(request).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Redirection to verification after success
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: request.email }
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.errors) {
            this.serverErrors.set(err.errors);
          }
        }
      });
    }
  }
}