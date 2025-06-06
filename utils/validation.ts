export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateUsername(username: string): boolean {
  return username.length >= 3;
}

export function validateAmount(amount: string): boolean {
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  return amountRegex.test(amount) && parseFloat(amount) > 0;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}