import {ExpenseDocument} from "../expense/schemas/expense.schema";

export const getDeltaBetweenDates = (from: Date, to: Date) =>
	new Date(from).getTime() - new Date(to).getTime();

export type DateDelta = {
	weeks: number;
	months: number;
}
export const subtractDate = (date = new Date(), weeks: number) => {
	date.setDate(date.getDate() - (weeks * 7));
	
	return date;
}

export const getExpensesByDate = (expenses: ExpenseDocument[], from: Date, to: Date) => expenses.filter(expense => {
	const expenseDate = new Date(expense.date).getTime();
	
	return (expenseDate < from.getTime()) && (expenseDate > to.getTime());
});