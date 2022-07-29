import {Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";

import {JwtGuard} from "./guards/jwt.guard";
import {JwtStrategy} from "./guards/jwt.strategy";

import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

import {UserModule} from "../user/user.module";


@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: 'secret',
				signOptions: {
					expiresIn: '1d'
				}
			})
		})],
	controllers: [AuthController],
	providers: [AuthService, JwtGuard, JwtStrategy]
})
export class AuthModule {
}
