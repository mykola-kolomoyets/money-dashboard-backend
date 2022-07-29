export class AddExpenseDto {
	userId: string;
	
	name: string;
	category: string;
	date: Date;
	amount: number;
	quantity: number;
}