import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';

import {AuthService} from "./auth.service";
import {RegisterDTO} from "../user/dto/register.dto";
import {UserDetails} from "../user/interfaces/user-details.interface";
import {LoginDTO} from "../user/dto/login.dto";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}
	
	@Post('/register')
	register(@Body() user: RegisterDTO): ReturnType<AuthService['register']> {
		return this.authService.register(user);
	}
	
	@Post('/login')
	@HttpCode(HttpStatus.OK)
	login(@Body() user: LoginDTO): ReturnType<AuthService['login']> {
		return this.authService.login(user);
	}
}
