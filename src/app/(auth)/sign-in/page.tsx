'use client';
import { z } from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useDebounceValue } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
	const [username, setUsername] = useState('');
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmittingForm, setIsSubmittingForm] = useState(false);
	const [usernameMesssage, setUsernameMessage] = useState('');

	const debouncedUsername = useDebounceValue(username, 500);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmittingForm(true);
		try {
			const res = await axios.post('/api/sign-up', data);
			toast({ title: 'Success', description: res.data.message });
			router.push(`/verify/${username}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			let errMsg = axiosError.response?.data.message ?? 'Unable to sign up';
			toast({ title: 'Sign Up failed', description: errMsg, variant: 'destructive' });
		} finally {
			setIsSubmittingForm(false);
		}
	};

	useEffect(() => {
		setIsCheckingUsername(true);
		setUsernameMessage('');
		const validateUsername = async () => {
			if (debouncedUsername) {
				try {
					const res = await axios.get(
						'/api/validate-username?username=' + username
					);
					setUsernameMessage(res.data.response.message);
					setIsCheckingUsername(false);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? 'Error checking username!'
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		validateUsername();
	}, [debouncedUsername]);

	return <div>SignIn</div>;
};

export default SignIn;
