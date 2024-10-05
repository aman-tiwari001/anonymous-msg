'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LockIcon, MessageCircleQuestionIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { signInSchema } from '@/schemas/signInSchema';
import { Button } from '@/components/ui/button';

const SignIn = () => {
	const { toast } = useToast();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true);
		const result = await signIn('credentials', {
			identifier: data.identifier,
			password: data.password,
			redirect: false,
		});
		console.log(result);
		setIsSubmitting(false);
		if (result?.error) {
			toast({
				title: 'Login failed',
				description: result.error,
				variant: 'destructive',
			});
		}
		if (result?.url) {
			toast({
				title: 'Login successful',
				description: 'Redirecting to dashboard...',
				variant: 'default',
			});
			router.replace('/dashboard');
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen text-black bg-black'>
			<div className='max-sm:w-[90%] w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className='text-center'>
					<h1 className='text-4xl max-sm:text-[2rem] text-black font-extrabold tracking-tight lg:text-5xl mb-6 max-sm:mb-2 flex items-center gap-2'>
						Login
						<MessageCircleQuestionIcon size={50} /> Myst!Q
					</h1>
					<p className='mb-4 max-sm:mb- max-sm:text-[12px] flex items-center gap-1'>
						Login to ask questions
						<LockIcon className='max-sm:w-3' size={20} />
						anonymously!
					</p>
				</div>

				{/* Implementing React Hook Form */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-3 justify-center w-full'
				>
					<label htmlFor='username'>
						Username/Email :
						<br />
						<input
							className='px-2 py-1 w-full border-[2px] border-black rounded-md text-lg'
							type='text'
							id='username'
							{...register('identifier', {
								required: 'Username or email is required',
							})}
						/>
						<p className='text-red-500 text-md'>{errors.identifier?.message}</p>
					</label>
					<label htmlFor='password'>
						Password :
						<br />
						<input
							className='px-2 py-1 w-full border-[2px] border-black rounded-md text-lg'
							type='password'
							id='password'
							{...register('password', { required: 'Password is required' })}
						/>
						<p className='text-red-500 text-md'>{errors.password?.message}</p>
					</label>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? <Loader2 className='animate-spin' /> : 'Login'}
					</Button>
				</form>

				<div className='text-center mt-4'>
					<p>
						New here?{' '}
						<Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
