import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

    // Theme state using Angular signals - always light
    currentTheme = signal<Theme>('light');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.applyTheme('light');
        }
    }

    private applyTheme(theme: Theme) {
        const htmlElement = this.document.documentElement;
        htmlElement.classList.remove('dark');
    }
}
