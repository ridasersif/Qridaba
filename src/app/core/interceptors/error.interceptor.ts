import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred.';

            switch (error.status) {
                case 0:
                    // Network error or no internet
                    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
                    break;

                case 400:
                    // Bad Request - validation error usually
                    errorMessage = error.error?.message || 'Bad request. Please check your input.';
                    break;

                case 401:
                    // Unauthorized - token expired or invalid
                    errorMessage = error.error?.message || 'Session expired. Please log in again.';
                    // Clear stored tokens and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    router.navigate(['/auth/login']);
                    break;

                case 403:
                    // Forbidden - not enough permissions
                    errorMessage = error.error?.message || 'You do not have permission to perform this action.';
                    break;

                case 404:
                    // Not Found
                    errorMessage = error.error?.message || 'The requested resource was not found.';
                    break;

                case 409:
                    // Conflict - e.g. duplicate email
                    errorMessage = error.error?.message || 'A conflict occurred. Please try again.';
                    break;

                case 422:
                    // Unprocessable Entity - validation errors
                    errorMessage = error.error?.message || 'Validation failed. Please review your input.';
                    break;

                case 429:
                    // Too Many Requests
                    errorMessage = 'Too many requests. Please wait a moment before trying again.';
                    break;

                case 500:
                    // Internal Server Error
                    errorMessage = 'Internal server error. Please try again later.';
                    break;

                case 502:
                    // Bad Gateway
                    errorMessage = 'Server temporarily unavailable. Please try again shortly.';
                    break;

                case 503:
                    // Service Unavailable
                    errorMessage = 'Service is temporarily unavailable. Please try again later.';
                    break;

                default:
                    errorMessage = error.error?.message || `Unexpected error (${error.status}). Please try again.`;
            }

            // Enrich the error object with the user-friendly message
            const enrichedError = {
                ...error,
                error: {
                    ...error.error,
                    message: errorMessage,
                    status: error.status,
                    errors: error.error?.errors || {}
                }
            };

            return throwError(() => enrichedError);
        })
    );
};
