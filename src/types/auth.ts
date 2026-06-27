export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterFormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: string;
  accessToken: string;
}
