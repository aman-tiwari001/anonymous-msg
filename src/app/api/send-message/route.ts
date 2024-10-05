import UserModel, { Message } from '@/model/User';

export async function POST(req: Request) {
	try {
		const { message, username } = await req.json();
		if (!message || !username) {
			return Response.json(
				{
					success: false,
					message: 'Message and recipent username is required',
				},
				{ status: 400 }
			);
		}
		const user = await UserModel.findOne({ username });
		if (!user) {
			return Response.json(
				{ success: false, message: 'User not found' },
				{ status: 404 }
			);
		}
		if (!user.isAcceptingMessages) {
			return Response.json(
				{ success: false, message: 'User is not accepting messages' },
				{ status: 400 }
			);
		}
		const msg: Message = { content: message } as Message;
		user.messages.push(msg);
	} catch (error) {
    console.error('Error in sending message', error);
    return Response.json(
      { success: false, message: 'Error in sending message.' },
      { status: 500 }
    );
  }
}
