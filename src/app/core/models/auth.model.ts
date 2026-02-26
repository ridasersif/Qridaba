import { UserResponse } from "./user.model";


export interface AuthenticationResponse {
  access_token: string;  
  refresh_token: string; 
  user: UserResponse;
  message: string;
}

export interface MessageResponse {
  message: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string; 
}

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}