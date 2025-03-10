import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/utils/sendVerificationEmail';

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, email, password } = await request.json();

		const existingVerifiedUserByUsername = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUserByUsername) {
			return Response.json(
				{
					success: false,
					message: 'Username is already taken',
				},
				{ status: 400 }
			);
		}

		const existingUserByEmail = await UserModel.findOne({ email });
		let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: 'User already exists with this email',
					},
					{ status: 400 }
				);
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.username = username;
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 600000); // valid for 10 mins
				await existingUserByEmail.save();
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getMinutes() + 1);

			const existingUnverifedUserByUsername = await UserModel.findOne({
				username,
				isVerified: false,
			});

			if (existingUnverifedUserByUsername) {
				existingUnverifedUserByUsername.email = email;
				existingUnverifedUserByUsername.password = hashedPassword;
				existingUnverifedUserByUsername.verifyCode = verifyCode;
				existingUnverifedUserByUsername.verifyCodeExpiry = expiryDate;
				await existingUnverifedUserByUsername.save();
			} else {
				const newUser = new UserModel({
					username,
					email,
					password: hashedPassword,
					verifyCode,
					verifyCodeExpiry: expiryDate,
					isVerified: false,
					isAcceptingMessages: true,
					messages: [],
				});
				await newUser.save();
			}
		}

		// Send verification email
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode
		);
		if (!emailResponse.success) {
			return Response.json(
				{
					success: false,
					message: emailResponse.message,
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{
				success: true,
				message: 'User registered successfully. Please verify your account.',
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error('Error registering user:', error);
		return Response.json(
			{
				success: false,
				message: error?.message || 'Error registering user',
			},
			{ status: 500 }
		);
	}
}
