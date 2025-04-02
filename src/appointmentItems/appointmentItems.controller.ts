import {
  Controller,
  Get,
  Headers,
  HttpException,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import AppointmentItemsSevice from './appointmentItems.service';
import { AppService } from 'src/app.service';

@Controller('api/appointment-items')
export default class AppointmentItemsController {
  constructor(
    @Inject(AppointmentItemsSevice)
    private readonly appointmentItemsService: AppointmentItemsSevice,
    @Inject(AppService)
    private readonly appService: AppService,
  ) {}

  @Get('get-all')
  async getAppointmentItems(
    @Query('appointmentId', ParseIntPipe) appointmentId: number,
    @Headers('authorization') authHeader: string,
  ) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      throw new HttpException('Not authorized', 401);
    }
    const verified = await this.appService.verifyAuth(token);
    if (verified.response) {
      return this.appointmentItemsService.getAllAppointmentItems(appointmentId);
    } else {
      throw new HttpException('Not authorized', 401);
    }
  }
}
