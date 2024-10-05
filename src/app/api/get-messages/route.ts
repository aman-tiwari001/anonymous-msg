import { User } from 'next-auth';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import mongoose from 'mongoose';

export async function GET(req: Request) {
	await dbConnect();
	const session = await getServerSession(authOptions);
	const _user: User = session?.user;

	if (!session || !_user) {
		return Response.json(
			{ success: false, message: 'Not authenticated.' },
			{ status: 401 }
		);
	}
	const userId = new mongoose.Types.ObjectId(_user._id);
	try {
		// mongodb aggregation pipline for extracting and sorting messages in multiple stages
		const user = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: '$messages' },
			{ $sort: { 'messages.createdAt': -1 } },
			{ $group: { _id: '$_id', messages: { $push: '$messages' } } },
		]);
		if (!user) {
			return Response.json(
				{ success: false, message: 'User not found.' },
				{ status: 404 }
			);
		}
    // check return type of aggreate function, also study aggregation pipline
		return Response.json(
			{ success: true, messages: user[0].messages },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error in getting messages', error);
		return Response.json(
			{ success: false, message: 'Error in getting messages.' },
			{ status: 500 }
		);
	}
}
