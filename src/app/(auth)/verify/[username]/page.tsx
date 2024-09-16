'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function VerifyAccount() {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
		defaultValues: {
			code: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			setIsSubmitting(true);
			const response = await axios.post<ApiResponse>(`/api/verify-code`, {
				username: params.username,
				code: data.code,
			});

			toast({
				title: 'Success',
				description: response.data.message,
			});
			router.push('/sign-in');
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: 'Verification Failed',
				description:
					axiosError.response?.data.message ??
					'An error occurred. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='bg-pri flex justify-center items-center min-h-screen'>
			<div className='max-sm:w-[90%] w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='w-full space-y-6'
					>
						<FormLabel className='text-4xl text-pri my-10'>
							Verify your email
						</FormLabel>
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormDescription>
										Please enter the verfication code sent to your email.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>
							{isSubmitting ? <Loader2 className='animate-spin' /> : 'Submit'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
