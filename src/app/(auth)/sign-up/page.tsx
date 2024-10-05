'use client';

import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, LockIcon, MessageCircleQuestionIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
	const [username, setUsername] = useState('');
	const [usernameMessage, setUsernameMessage] = useState('');
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const debounced = useDebounceCallback(
		setUsername,
		500
	);

	const router = useRouter();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage('');
				try {
					const response = await axios.get<ApiResponse>(
						`/api/validate-username?username=${username}`
					);
					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? 'Error checking username'
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsernameUnique();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>('/api/sign-up', data);

			toast({
				title: 'Success',
				description: response.data.message,
			});

			router.replace(`/verify/${username}`);

			setIsSubmitting(false);
		} catch (error) {
			console.error('Error during sign-up:', error);

			const axiosError = error as AxiosError<ApiResponse>;

			// Default error message
			let errorMessage = axiosError.response?.data.message;
			('There was a problem with your sign-up. Please try again.');

			toast({
				title: 'Sign Up Failed',
				description: errorMessage,
				variant: 'destructive',
			});

			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen text-black bg-black'>
			<div className='max-sm:w-[90%] w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className='text-center'>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 max-sm:mb-2 flex items-center gap-2'>
						Join <MessageCircleQuestionIcon size={50} /> Myst!Q
					</h1>
					<p className='mb-4 max-sm:mb-2 max-sm:text-[12px] flex items-center gap-1'>
						Sign up to ask questions
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
						Username :
						<br />
						<input
							className='px-2 py-1 w-full border-[2px] border-black rounded-md text-lg'
							type='text'
							id='username'
							{...register('username', { required: 'Username is required' })}
							onChange={(e) => debounced(e.target.value)}
						/>
						{isCheckingUsername ? (
							<Loader2 className='animate-spin mt-2' />
						) : (
							username && (
								<p
									className={`${
										usernameMessage === 'Username is available'
											? 'text-green-600'
											: 'text-red-500'
									}`}
								>
									{usernameMessage}
								</p>
							)
						)}
						<p className='text-red-500 text-md'>{errors.username?.message}</p>
					</label>
					<label htmlFor='email'>
						Email :
						<br />
						<input
							className='px-2 py-1 w-full border-[2px] border-black rounded-md text-lg'
							type='email'
							id='email'
							{...register('email', { required: 'Email is required' })}
						/>
						<p className='text-red-500 text-md'>{errors.email?.message}</p>
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
						{isSubmitting ? <Loader2 className='animate-spin' /> : 'Sign Up'}
					</Button>
				</form>

				<div className='text-center mt-4'>
					<p>
						Already a member?{' '}
						<Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
