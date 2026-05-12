export type ValidationResult = Readonly<{
  isValid: boolean;
  message?: string;
}>;

export const validateName = (name: string): ValidationResult => {
  if (name.trim().length < 3) {
    return { isValid: false, message: '계정명은 3자 이상 입력해주세요.' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 4) {
    return { isValid: false, message: '비밀번호는 4자 이상 입력해주세요.' };
  }
  return { isValid: true };
};

export const validateRequired = (value: string, label: string): ValidationResult => {
  if (value.trim().length === 0) {
    return { isValid: false, message: `${label}을(를) 입력해주세요.` };
  }
  return { isValid: true };
};
