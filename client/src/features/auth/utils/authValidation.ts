import { VALIDATION_RULES } from '../../../constants/app.constants';

export interface ValidationError {
  field: string;
  message: string;
}

// Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < VALIDATION_RULES.PASSWORD.MIN) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN} characters`;
  }
  if (password.length > VALIDATION_RULES.PASSWORD.MAX) {
    return `Password must be less than ${VALIDATION_RULES.PASSWORD.MAX} characters`;
  }
  return null;
};

// First name validation
export const validateFirstName = (firstName: string): string | null => {
  if (!firstName) {
    return 'First name is required';
  }
  if (firstName.length < VALIDATION_RULES.FIRST_NAME.MIN) {
    return `First name must be at least ${VALIDATION_RULES.FIRST_NAME.MIN} characters`;
  }
  if (firstName.length > VALIDATION_RULES.FIRST_NAME.MAX) {
    return `First name must be less than ${VALIDATION_RULES.FIRST_NAME.MAX} characters`;
  }
  const nameRegex = /^[A-Za-z\s'-]+$/;
  if (!nameRegex.test(firstName)) {
    return 'First name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

// Last name validation
export const validateLastName = (lastName: string): string | null => {
  if (!lastName) {
    return 'Last name is required';
  }
  if (lastName.length < VALIDATION_RULES.LAST_NAME.MIN) {
    return `Last name must be at least ${VALIDATION_RULES.LAST_NAME.MIN} characters`;
  }
  if (lastName.length > VALIDATION_RULES.LAST_NAME.MAX) {
    return `Last name must be less than ${VALIDATION_RULES.LAST_NAME.MAX} characters`;
  }
  const nameRegex = /^[A-Za-z\s'-]+$/;
  if (!nameRegex.test(lastName)) {
    return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

// OTP validation
export const validateOtp = (otp: string): string | null => {
  if (!otp) {
    return 'OTP code is required';
  }
  if (!/^\d{6}$/.test(otp)) {
    return 'OTP must be 6 digits';
  }
  return null;
};

// Complete registration validation
export const validateRegistration = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const firstNameError = validateFirstName(data.firstName);
  if (firstNameError) errors.push({ field: 'firstName', message: firstNameError });
  
  const lastNameError = validateLastName(data.lastName);
  if (lastNameError) errors.push({ field: 'lastName', message: lastNameError });
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });
  
  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.push({ field: 'confirmPassword', message: confirmPasswordError });
  
  return errors;
};

// Complete login validation
export const validateLogin = (data: {
  email: string;
  password: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });
  
  return errors;
};