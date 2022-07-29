import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from 'mongoose';
import {Expense} from "../../expense/schemas/expense.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({required: true})
	name: string;
	
	@Prop({required: true, unique: true})
	email: string;
	
	@Prop({required: true})
	password: string;
	
	@Prop({required: false})
	expenses: Expense[];
	
	@Prop({required: false})
	categories: {
		name: string;
		monthPlan: number;
	}[];
}

export const UserSchema = SchemaFactory.createForClass(User);