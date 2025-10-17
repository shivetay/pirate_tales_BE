import type { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { AppError } from "../utils";

export const signUp = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, user_name, password, password_confirm } = req.body;

		const userCheck = await User.findOne({ email, user_name });

		if (!email || !user_name || !password || !password_confirm) {
			return next(new AppError("Please provide all fields", 400));
		}

		// TODO compare passwords securely
		if (password !== password_confirm) {
			return next(new AppError("Passwords do not match", 400));
		}

		if (userCheck) {
			return next(new AppError("User already exists", 409));
		}

		const newUser = await User.create({
			email,
			user_name,
			password,
			password_confirm,
		});

		res.status(201).json({
			status: "success",
			data: {
				user: newUser,
			},
		});
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
			return next(new AppError("Please provide all fields", 400));
		}

		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return next(new AppError("User not found", 404));
		}

		const isPasswordMatch = user.comparePassword(password, user.password);

		if (!user || !isPasswordMatch) {
			return next(new AppError("Invalid email or password", 401));
		}
		return res.status(200).json({
			status: "success",
			message: "Login successful",
		});
	} catch (error) {
		next(error);
	}
};
