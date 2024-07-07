import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { sendVerificationEmail } from '@/utils/sendVerificationEmail';

export async function POST(req: Request) {
	await dbConnect();
	try {
		const { username } = await req.json();
		const user = await UserModel.findOne({ username });
		if (!user)
			return Response.json(
				{ success: false, message: 'User not found.' },
				{ status: 404 }
			);
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		const expiryDate = new Date(Date.now() + 600000);
		user.verifyCode = code;
		user.verifyCodeExpiry = expiryDate;
		await user.save();
		const emailResp = await sendVerificationEmail(user?.email, username, code);
		if (!emailResp.success) {
			return Response.json(
				{
					success: false,
					message: 'Unable to send verification at this moment',
				},
				{ status: 500 }
			);
		}
		return Response.json(
			{
				success: true,
				message: 'Verification code sent, check email.',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error resending verification code.', error);
		Response.json(
			{ success: false, message: 'Error resending verification code.' },
			{ status: 500 }
		);
	}
}
