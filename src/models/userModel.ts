import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
import type { IUserSchema } from './types';

const userSchema = new mongoose.Schema<IUserSchema>(
	{
		user_name: {
			type: String,
			required: [true, 'Please provide a username'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters long'],
			maxlength: [20, 'Username must be less than 20 characters long'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			trim: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: [8, 'Password must be at least 8 characters long'],
			maxlength: [20, 'Password must be less than 20 characters long'],
			select: false,
		},
		password_confirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				validator: function (this: IUserSchema, value: string) {
					return value === this.password;
				},
			},
			message: 'Passwords do not match',
		},
		password_changed_at: {
			type: Date,
			default: Date.now,
		},
		password_reset_token: {
			type: String,
			default: null,
		},
		password_reset_expires: {
			type: Date,
			default: null,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		cave: {
			type: Object,
			default: null,
		},
		resources: {
			type: Object,
			default: null,
		},
		ship: {
			type: Object,
			default: null,
		},
		reputation: {
			type: Object,
			default: null,
		},
		last_resource_update: {
			type: Date,
			default: Date.now,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		updated_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: false,
	},
);

// Pre-save middleware to update updated_at field
userSchema.pre('save', function (next) {
	this.updated_at = new Date();
	next();
});

// Password compare and hash
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const saltRounds = 12;
		this.password = await bcrypt.hash(this.password, saltRounds);
		this.password_confirm = '';
		next();
	} catch (error) {
		next(error as Error);
	}
});

userSchema.methods.comparePassword = async (
	candidatePassword: string,
	userPassword: string,
) => {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUserSchema>('User', userSchema);

export default User;
