import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model'; // Assure-toi d'avoir ce modèle

export interface RoleResponse {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin/roles`; // À vérifier si c'est public ou non

  getAssignableRoles(): Observable<RoleResponse[]> {
    return this.http.get<ApiResponse<RoleResponse[]>>(`${this.API_URL}/assignable`)
      .pipe(
        map(response => response.data) // On extrait juste la liste des roles de l'ApiResponse
      );
  }
}