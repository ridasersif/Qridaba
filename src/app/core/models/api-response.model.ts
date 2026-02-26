/**
 * Generic interface for all API responses from Spring Boot
 * Matches the ResponseBuilder structure
 */
export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;           // Here T can be a single object or an array
  timestamp: string;
  success: boolean;  // If your backend adds this flag
}