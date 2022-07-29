import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type ExpenseDocument = Expense & Document;

@Schema()
export class Expense {
	@Prop({required: true})
	name: string;
	
	@Prop({required: true})
	userId: string;
	
	@Prop({required: true})
	category: string;
	
	@Prop({required: true})
	date: Date;
	
	@Prop({required: true})
	amount: number;
	
	@Prop({required: true})
	quantity: number;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);