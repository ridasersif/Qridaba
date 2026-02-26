import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(group: any) {
  const pwd = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pwd === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  passwordReset = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  email: string = '';

  // 6 OTP digit controls
  codeControls: FormControl[] = Array.from({ length: 6 }, () => new FormControl(''));

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  getCode(): string {
    return this.codeControls.map(c => c.value).join('');
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    this.codeControls[index].setValue(value);
    input.value = value;
    if (value && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codeControls[index].value && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || '';
    text.split('').forEach((char, i) => {
      if (i < 6) this.codeControls[i].setValue(char);
    });
    const lastIdx = Math.min(text.length, 5);
    document.getElementById(`reset-otp-${lastIdx}`)?.focus();
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.getCode().length === 6) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.resetPassword({
        email: this.email,
        code: this.getCode(),
        newPassword: this.resetForm.value.newPassword!
      }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.passwordReset.set(true);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Invalid or expired code. Please try again.');
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
