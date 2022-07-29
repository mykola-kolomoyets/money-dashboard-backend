import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {UserDocument} from "./schemas/user.schema";

import {UserDetails} from "./interfaces/user-details.interface";
import passport from "passport";

@Injectable()
export class UserService {
	constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {
	}
	
	_getUserDetails({_id, name, email}: UserDocument): UserDetails {
		return {
			id: _id,
			name,
			email,
		}
	}
	
	async create(name: string, email: string, hashedPassword: string): Promise<UserDocument> {
		const user = new this.userModel({name, email, password: hashedPassword, categories: []});
		
		return user.save();
	}
	
	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({email}).exec();
	}
	
	async findById(id: string): Promise<UserDetails | null> {
		const user = await this.userModel.findById(id).exec();
		
		if (!user) return null;
		
		return this._getUserDetails(user);
	}
	
	
}
