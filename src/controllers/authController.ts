import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import type { IUserSchema } from '../models/types';
import { AppError } from '../utils';

// Creates JWT token
const signToken = (user_id: string) => {
	const secret = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;
	if (!secret || !expiresIn) {
		throw new Error('Oops something went wrong');
	}
	return jwt.sign({ user_id }, secret, {
		expiresIn: parseInt(expiresIn, 10),
		algorithm: 'HS256',
		issuer: 'pirate_tales_be',
	});
};

// Creates send token for response
const createSendToken = (
	user: Omit<
		IUserSchema,
		| 'password'
		| 'password_confirm'
		| 'password_changed_at'
		| 'password_reset_token'
		| 'password_reset_expires'
	>,
	statusCode: number,
	res: Response,
	isLogin: boolean,
) => {
	const token = signToken(user.id);
	const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
	if (!cookieExpiresIn) {
		throw new Error('Oops something went wrong');
	}
	const cookieOptions = {
		expires: new Date(
			Date.now() + parseInt(cookieExpiresIn, 10) * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict' as const,
		path: '/',
	};

	res.cookie('jwt', token, cookieOptions);

	res.status(statusCode).json({
		status: 'success',
		token,
		message: isLogin ? 'Login successful' : 'Registration successful',
	});
};

export const signUp = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, user_name, password, password_confirm } = req.body;

		const userCheck = await User.findOne({ email, user_name });

		if (!email || !user_name || !password || !password_confirm) {
			next(new AppError('Please provide all fields', 400));
			return;
		}

		if (userCheck) {
			next(new AppError('User already exists', 409));
			return;
		}

		const newUser = await User.create({
			email,
			user_name,
			password,
			password_confirm,
		});

		createSendToken(newUser, 201, res, false);
	} catch (error) {
		next(error);
	}
};

export const signIn = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			next(new AppError('Please provide all fields', 400));
			return;
		}

		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			next(new AppError('User not found', 404));
			return;
		}

		const isPasswordMatch = await user.comparePassword(password, user.password);

		if (!user || !isPasswordMatch) {
			next(new AppError('Invalid email or password', 401));
			return;
		}

		createSendToken(user, 200, res, true);
	} catch (error) {
		next(error);
	}
};
