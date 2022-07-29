import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";

import {Model} from "mongoose";
import {Expense, ExpenseDocument} from "./schemas/expense.schema";
import {UserService} from "../user/user.service";
import {UserDocument} from "../user/schemas/user.schema";
import {AddExpenseDto} from "./dto/add-expense.dto";
import {GetAllExpensesDto} from "./dto/get-all-expenses.dto";
import {GetExpensesByCategoryDto} from "./dto/get-expenses-by-category.dto";
import {AddCategoryDto} from "./dto/add-category.dto";

@Injectable()
export class ExpenseService {
	constructor(
		@InjectModel('Expense') private readonly expenseModel: Model<ExpenseDocument>,
		@InjectModel('User') private readonly userModel: Model<UserDocument>
	) {
	}
	
	async addExpense(dto: AddExpenseDto) {
		const categoryName = dto.category;
		
		const userCategories =  await this.getCategoriesNames(dto.userId);
		
		if (!userCategories?.includes(categoryName)) return 'Category doesnt exist';
		
		return this.create(dto);
	}
	
	async getAllExpenses({userId}: GetAllExpensesDto) {
		const user = this.userModel.findById(userId);
		
		if (!user) return null;
		
		return this.expenseModel.find({userId});
	}
	
	async getExpensesByCategory({userId, category}: GetExpensesByCategoryDto) {
		const user = this.userModel.findById(userId);
		
		if (!user) return null;
		
		return this.expenseModel.find({userId, category});
	}
	
	async addCategory({userId, ...category}: AddCategoryDto) {
		const user = this.userModel.findById(userId);
		
		if (!user) return null;
		
		return user.updateOne({_id: userId}, {
			$push: {categories: category}
		})
	}
	
	async create(expenseData: AddExpenseDto): Promise<ExpenseDocument> {
		const expense = new this.expenseModel(expenseData);
		
		return expense.save();
	}
	
	async getCategoriesNames(userId: string) {
		const categories = await this.userModel.findOne({
			_id: userId,
		}, {'categories.name': 1});
		
		return categories?.categories.map(item => item.name);
	}
	
}
