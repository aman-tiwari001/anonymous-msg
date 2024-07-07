import { User } from 'next-auth';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
	await dbConnect();
	const session = await getServerSession(authOptions);
	const user: User = session?.user;
	if (!session || !session.user) {
		return Response.json(
			{ success: false, message: 'User not Authenticated.' },
			{ status: 401 }
		);
	}
	const userId = user._id;
	try {
		const { acceptMessages } = await req.json();
		const user = await UserModel.findById(userId);
		if (!user)
			return Response.json(
				{ success: false, message: 'User not found.' },
				{ status: 404 }
			);
		user.isAcceptingMessages = acceptMessages;
		await user.save();
		return Response.json(
			{ success: true, message: 'Accept messages toggled', result: user },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error toggling accept messages.', error);
		return Response.json(
			{ success: false, message: 'Error toggling accept messages' },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	await dbConnect();
	const session = await getServerSession(authOptions);
	const user: User = session?.user;
	if (!session || !session.user) {
		return Response.json(
			{ success: false, message: 'User not Authenticated.' },
			{ status: 401 }
		);
	}
	const userId = user._id;
	try {
		const user = await UserModel.findById(userId);
		if (!user)
			return Response.json(
				{ success: false, message: 'User not found.' },
				{ status: 404 }
			);
		return Response.json(
			{ success: true, isAcceptingMessages: user.isAcceptingMessages },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error getting accept messages status.', error);
		return Response.json(
			{ success: false, message: 'Error getting accept messages status.' },
			{ status: 500 }
		);
	}
}
