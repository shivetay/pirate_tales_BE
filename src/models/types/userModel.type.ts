import type { Document } from "mongoose";

export interface IUserSchema extends Document {
	user_name: string;
	email: string;
	password: string;
	password_confirm: string;
	password_changed_at: Date;
	password_reset_token: string;
	password_reset_expires: Date;
	role: string;
	cave: unknown;
	resources: unknown;
	ship: unknown;
	reputation: unknown;
	last_resource_update: Date;
	created_at: Date;
	updated_at: Date;
	comparePassword(candidatePassword: string, userPassword: string): boolean;
}
