import {Injectable} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import {User} from "../user/schemas/user.schema";
import {UserDetails} from "../user/interfaces/user-details.interface";

import {UserService} from "../user/user.service";

import {RegisterDTO} from "../user/dto/register.dto";
import {LoginDTO} from "../user/dto/login.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {
	}
	
	async register(registerDto: Readonly<RegisterDTO>): Promise<UserDetails | string> {
		const {name, email, password} = registerDto;
		
		const existingUser = await this.userService.findByEmail(email);
		
		if (existingUser) return 'Email taken';
		
		const hashedPassword = await this._hashPassword(password);
		
		const newUser = await this.userService.create(name, email, hashedPassword);
		
		return this.userService._getUserDetails(newUser);
	}
	
	async login(loginDto: LoginDTO): Promise<{ token: string } | null> {
		const {email, password} = loginDto;
		
		const user = await this.validateUser(email, password);
		
		if (!user) return null;
		
		const token = await this.jwtService.signAsync({user});
		
		return { token };
	}
	
	private async _hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 12);
	}
	
	async isPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}
	
	async validateUser(email: string, password: string): Promise<UserDetails | null> {
		const user = await this.userService.findByEmail(email);
		const isUserExist = !!user;
		
		if (!isUserExist) return null;
		
		const isPasswordMatch = this.isPasswordMatch(password, user.password);
		
		return isPasswordMatch ? this.userService._getUserDetails(user) : null;
	}
}
