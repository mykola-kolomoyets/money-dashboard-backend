import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";

import {Model} from "mongoose";
import {Expense, ExpenseDocument} from "./schemas/expense.schema";
import {UserDocument} from "../user/schemas/user.schema";
import {AddExpenseDto} from "./dto/add-expense.dto";
import {GetAllExpensesDto} from "./dto/get-all-expenses.dto";
import {GetExpensesByCategoryDto} from "./dto/get-expenses-by-category.dto";
import {AddCategoryDto} from "./dto/add-category.dto";
import {Period} from "../utils/enums";
import {getDeltaBetweenDates, getExpensesByDate, subtractDate} from "../utils/functions";

@Injectable()
export class ExpenseService {
	constructor(
		@InjectModel('Expense') private readonly expenseModel: Model<ExpenseDocument>,
		@InjectModel('User') private readonly userModel: Model<UserDocument>
	) {
	}
	
	async addExpense(dto: AddExpenseDto) {
		const categoryName = dto.category;
		
		const userCategories = await this.getCategoriesNames(dto.userId);
		
		if (!userCategories?.includes(categoryName))
			throw new HttpException('Category does not exist', HttpStatus.BAD_REQUEST);
		
		return this.create(dto);
	}
	
	async getAllExpenses({userId}: GetAllExpensesDto): Promise<null | ExpenseDocument[]> {
		try {
			const user = await this.userModel.findById(userId);
			
			if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
			
			return this.expenseModel.find({userId});
			
		} catch (error) {
			throw new HttpException({message: error.message}, HttpStatus.BAD_REQUEST);
		}
	}
	
	async getExpensesByCategory({userId, category}: GetExpensesByCategoryDto): Promise<null | ExpenseDocument[]> {
		try {
			const user = this.userModel.findById(userId);
			
			if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
			
			return this.expenseModel.find({userId, category});
			
		} catch (error) {
			throw new HttpException({message: error.message}, HttpStatus.BAD_REQUEST);
		}
	}
	
	async addCategory({userId, ...category}: AddCategoryDto): Promise<null | 'OK'> {
		try {
			const user = this.userModel.findById(userId);
			
			if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
			
			user.updateOne({_id: userId}, {
				$push: {categories: category}
			});
			
			return 'OK';
		} catch (error) {
			throw new HttpException({message: error.message}, HttpStatus.BAD_REQUEST);
		}
	}
	
	async create(expenseData: AddExpenseDto): Promise<ExpenseDocument> {
		const expense = new this.expenseModel(expenseData);
		
		return expense.save();
	}
	
	async getCategoriesNames(userId: string): Promise<string[]> {
		try {
			const categories = await this.userModel.findOne({
				_id: userId
			}, {'categories.name': 1});
			
			return categories?.categories.map(item => item.name);
			
		} catch (error) {
			throw new HttpException({message: error.message}, HttpStatus.BAD_REQUEST);
		}
	}
	
	async getFullCategories(userId: string): Promise<{ [key: string]: number }> {
		try {
			const categories = await this.userModel.findOne({
				_id: userId
			});
			
			return categories?.categories
				.reduce((acc, curr) => ({...acc, [curr.name]: curr.monthPlan}), {});
			
		} catch (error) {
			throw new HttpException({message: error.message}, HttpStatus.BAD_REQUEST);
		}
	}
	
	async getActivities(userId: string): Promise<{ [key: string]: number }> {
		const allExpenses = await this.getAllExpenses({userId});
		
		return allExpenses.reduce((acc, curr) => ({
			...acc,
			[curr.category]: curr.amount + (acc[curr.category] || 0)
		}), {});
	}
	
	async getLastTransactions(userId: string): Promise<ExpenseDocument[]> {
		return (await this.getAllExpenses({userId}))
			.sort((curr, next) => getDeltaBetweenDates(curr.date, next.date))
			.slice(0, 11);
	}
	
	async getStatistics(userId: string, period: Period) {
		const allExpenses = await this.getAllExpenses({userId});
		
		const today = new Date();
		
		const monthDate = subtractDate(new Date(), 4);
		const twoMonthsDate = subtractDate(monthDate, 4);
		
		const weekDate = subtractDate(new Date(), 1);
		const twoWeeksDate = subtractDate(weekDate, 1);
		
		
		const weekExpenses = getExpensesByDate(allExpenses, today, weekDate)
			.reduce((acc, curr) => acc + curr.amount, 0);
		
		const lastWeekExpenses = getExpensesByDate(allExpenses, weekDate, twoWeeksDate)
			.reduce((acc, curr) => acc + curr.amount, 0);
		
		const monthExpenses = getExpensesByDate(allExpenses, today, monthDate)
			.reduce((acc, curr) => acc + curr.amount, 0);
		
		const lastMonthExpenses = getExpensesByDate(allExpenses, monthDate, twoMonthsDate)
			.reduce((acc, curr) => acc + curr.amount, 0);
		
		return {
			weekExpenses: {
				currentValue: weekExpenses,
				previousValue: lastWeekExpenses
			},
			monthExpenses: {
				currentValue: monthExpenses,
				previousValue: lastMonthExpenses
			}
		}
	}
}
