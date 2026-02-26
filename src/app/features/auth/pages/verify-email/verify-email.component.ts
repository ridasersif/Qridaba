import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  countdown = signal<number>(60);
  email: string = '';

  // 6 individual controls for OTP digits
  codeControls: FormControl[] = Array.from({ length: 6 }, () => new FormControl(''));

  verifyForm = this.fb.group({});

  private countdownInterval: any;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    this.countdown.set(60);
    this.countdownInterval = setInterval(() => {
      this.countdown.update(v => {
        if (v <= 1) { clearInterval(this.countdownInterval); return 0; }
        return v - 1;
      });
    }, 1000);
  }

  isCodeComplete(): boolean {
    return this.codeControls.every(c => c.value?.length === 1);
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
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codeControls[index].value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || '';
    text.split('').forEach((char, i) => {
      if (i < 6) this.codeControls[i].setValue(char);
    });
    const lastIdx = Math.min(text.length, 5);
    document.getElementById(`otp-${lastIdx}`)?.focus();
  }

  resendCode(): void {
    if (!this.email) return;
    this.startCountdown();
    // Could call a resend endpoint here
  }

  onSubmit(): void {
    if (!this.isCodeComplete()) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.verifyEmail({ email: this.email, code: this.getCode() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Email verified successfully!');
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Invalid or expired code. Please try again.');
      }
    });
  }
}