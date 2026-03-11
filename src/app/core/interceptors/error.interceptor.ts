import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const storageService = inject(StorageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred.';

            if (error.status === 0) {
                errorMessage = 'Server is unreachable. Please check your network.';
            } else if (error.status === 401) {
                errorMessage = 'Session expired. Please log in again.';
                storageService.clear();
                router.navigate(['/auth/login'], { 
                    queryParams: { returnUrl: router.url } 
                });
            } else {
                errorMessage = error.error?.message || getDefaultMessage(error.status);
            }

            // Creating a standardized error object for components
            const handledError = {
                ...error,
                message: errorMessage,
                originalError: error.error
            };

            return throwError(() => handledError);
        })
    );
};

function getDefaultMessage(status: number): string {
    const errorMessages: Record<number, string> = {
        400: 'Bad request. Please verify your input.',
        403: 'Access denied. You do not have permission.',
        404: 'Requested resource not found.',
        409: 'A conflict occurred with existing data.',
        422: 'Validation failed.',
        429: 'Too many requests. Please try again later.',
        500: 'Internal server error.',
        503: 'Service temporarily unavailable.'
    };
    return errorMessages[status] || 'An unknown error occurred.';
}