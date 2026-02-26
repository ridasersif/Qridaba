import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  emailSent = signal<boolean>(false);
  sentEmail = '';

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      const email = this.forgotForm.value.email!;

      this.authService.forgotPassword({ email }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.sentEmail = email;
          this.emailSent.set(true);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Something went wrong. Please try again.');
        }
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.emailSent.set(false);
    this.sentEmail = '';
    this.forgotForm.reset();
  }
}
