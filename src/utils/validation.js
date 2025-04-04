import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .refine((email) => {
      // Additional validation if needed
      return true;
    }, { message: 'Invalid email format' })
});

export const validateEmail = (email) => {
  try {
    emailSchema.parse({ email });
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0].message 
      };
    }
    return { 
      isValid: false, 
      error: 'An unexpected error occurred' 
    };
  }
}; 