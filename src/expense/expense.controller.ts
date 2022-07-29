import {Body, Controller, Get, Post} from '@nestjs/common';
import {ExpenseService} from "./expense.service";
import {AddExpenseDto} from "./dto/add-expense.dto";
import {GetAllExpensesDto} from "./dto/get-all-expenses.dto";
import {GetExpensesByCategoryDto} from "./dto/get-expenses-by-category.dto";
import {AddCategoryDto} from "./dto/add-category.dto";
import {Period} from "../utils/enums";

@Controller('expense')
export class ExpenseController {
	constructor(private readonly expenseService: ExpenseService) {
	}
	
	@Get('/all')
	getAllExpenses(@Body() getExpensesDto: GetAllExpensesDto) {
		return this.expenseService.getAllExpenses(getExpensesDto);
	}
	
	@Get('/by-category')
	getExpensesByCategory(@Body() getByCategoryDto: GetExpensesByCategoryDto) {
		return this.expenseService.getExpensesByCategory(getByCategoryDto);
	}
	
	@Get('/categories')
	getCategories(@Body('userId') userId: string) {
		return this.expenseService.getCategoriesNames(userId);
	}
	
	@Get('/categories-full')
	getFullCategories(@Body('userId') userId: string) {
		return this.expenseService.getFullCategories(userId);
	}
	
	@Get('/activities')
	getActivities(@Body('userId') userId: string) {
		return this.expenseService.getActivities(userId);
	}
	
	@Get('/statistics')
	getStatistics(
		@Body('userId') userId: string,
		@Body('period') period: Period
	) {
		return this.expenseService.getStatistics(userId, period);
	}
	
	@Get('/last-transactions')
	getLastTransactions(@Body('userId') userId: string) {
		return this.expenseService.getLastTransactions(userId);
	}
	
	@Post('/add-item')
	addExpense(@Body() addExpenseDto: AddExpenseDto) {
		return this.expenseService.addExpense(addExpenseDto);
	}
	
	
	@Post('/add-category')
	addCategory(@Body() addCategoryDto: AddCategoryDto) {
		return this.expenseService.addCategory(addCategoryDto);
	}
}
