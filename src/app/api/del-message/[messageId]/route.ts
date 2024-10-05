import { getServerSession, User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function DELETE(
	req: Request,
	{ params }: { params: { messageId: string } }
) {
	try {
		await dbConnect();
		const msgId = params.messageId;
		const session = await getServerSession(authOptions);
		const user: User = session?.user;
		if (!session || !session.user) {
			return Response.json(
				{ success: false, message: 'User not Authenticated.' },
				{ status: 401 }
			);
		}
		const updatedUser = await UserModel.updateOne(
			{ _id: user._id },
			{ $pull: { messages: { _id: msgId } } }
		);
		if (updatedUser.modifiedCount === 0) {
			return Response.json(
				{ success: false, message: 'Message not found.' },
				{ status: 404 }
			);
		}
		return Response.json({
			success: true,
			message: 'Message deleted successfully.',
		});
	} catch (error) {
    console.error('Error in deleting message', error);
    return Response.json(
      { success: false, message: 'Error in deleting message.' },
      { status: 500 }
    );
  }
}
