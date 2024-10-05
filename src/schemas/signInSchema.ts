import { z } from 'zod';

export const signInSchema = z.object({
	identifier: z.string().min(1, 'Username or Email is required'),
	password: z.string().min(1, 'Password is required'),
});
