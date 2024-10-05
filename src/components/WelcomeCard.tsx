'use client';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

const WelcomeCard = () => {
	const { data: session, status } = useSession();
	const user: User = session?.user;
	return (
		<div>
			{user && (
				<h1 className='text-2xl font-bold'>
					Hi, {user.username || user.email}
				</h1>
			)}
		</div>
	);
};

export default WelcomeCard;
