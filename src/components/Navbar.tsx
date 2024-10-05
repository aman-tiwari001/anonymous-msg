'use client';

import { MessageCircleQuestionIcon } from 'lucide-react';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar = () => {
	const { data: session, status } = useSession();
	const user: User = session?.user;
	return (
		<nav className='flex justify-between bg-black max-sm:px-2 py-3 px-6 shadow-md'>
			<div className='flex gap-x-2 text-3xl max-sm:text-xl items-center'>
				<MessageCircleQuestionIcon size={40} />
				Myst!Q
			</div>
			<div>
				{status === 'authenticated' ? (
					<div className='flex gap-x-3 items-center'>
						<div className='text-md max-md:hidden'>Welcome, {user.username || user.email}!</div>
						<Button
							onClick={() => signOut()}
							className='bg-white max-sm:text-sm hover:bg-gray-100 text-md text-black'
						>
							Logout
						</Button>
					</div>
				) : (
					<div className='flex gap-x-3 items-center'>
						<Link href='/sign-in'>
							<Button className='bg-white max-sm:text-sm hover:bg-gray-100 text-md text-black'>
								Login
							</Button>
						</Link>
						<Link className='max-sm:text-sm' href={'/sign-up'}>
							Sign Up
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
