import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('login')
  login(@Body() loginCred: any) {
    return this.appService.login(loginCred);
  }
  @Get('verify')
  verifyAuth(@Headers('authorization') authHeader: string) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      throw new HttpException('Not authorized', 401);
    }
    return this.appService.verifyAuth(token);
  }
 
}
