import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ExpenseSchema} from "./schemas/expense.schema";
import {UserSchema} from "../user/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Expense', schema: ExpenseSchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}])
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService]
})
export class ExpenseModule {}
