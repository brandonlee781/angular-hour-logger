export interface AuthResponse {
  expires_in?: number;
  expiresAt?: string;
  access_token: string;
}

export interface Link {
  icon: string;
  text: string;
  id: string;
  isSelected: boolean;
}
