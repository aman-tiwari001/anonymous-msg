'use client';

import axios from 'axios';
import { Message } from '@/model/User';
import MessageCard from '@/components/MessageCard';
import WelcomeCard from '@/components/WelcomeCard';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

const Dashboard = () => {
	const [messageList, setMessageList] = useState<Message[]>([]);
	useEffect(() => {
		const fetchMessages = async () => {
			const res = await axios.get('/api/get-messages');
			setMessageList(res.data.messages);
		};
		fetchMessages();
	}, []);
	return (
		<div className='mx-6 my-6'>
			<Dialog>
				<div className='flex justify-between text-white'>
					<WelcomeCard />
					<DialogTrigger>
						<Button>Ask Question?</Button>
					</DialogTrigger>
				</div>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{messageList.map((message: Message) => {
				return (
					<MessageCard
						key={message._id}
						content={message.content}
						createdAt={new Date(message.createdAt)}
					/>
				);
			})}
		</div>
	);
};

export default Dashboard;
