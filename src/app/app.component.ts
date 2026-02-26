import { Component, inject,afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoleService } from './core/services/role.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private roleService = inject(RoleService);
 
  
  constructor() {
    // afterNextRender ensures this runs ONLY in the browser (client-side)
    afterNextRender(() => {
      this.testRolesConnection();
    });
  }

  testRolesConnection(): void {
    console.log('--- Fetching Roles from Spring Boot ---');
    
    this.roleService.getAssignableRoles().subscribe({
      next: (roles) => {
        console.log('✅ Success! Roles received:', roles);
      },
      error: (err) => {
        console.error('❌ Error fetching roles:', err);
        // Ici tu peux voir si c'est un problème de CORS ou de 403 Forbidden
      }
    });
  }


}
