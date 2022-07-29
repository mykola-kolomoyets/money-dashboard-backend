import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import {getMongoUrl} from "./utils";
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://kolomoyets:Nikolak05092001@cluster0.ybvor.mongodb.net/expenses?retryWrites=true&w=majority`
    ),
    UserModule,
    AuthModule,
    ExpenseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
