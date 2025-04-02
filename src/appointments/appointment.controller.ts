import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Inject,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import AppointmentService from './appointment.service';
import { AppService } from 'src/app.service';

@Controller('/api/appointments')
export default class AppointmentsController {
  constructor(
    @Inject(AppointmentService)
    private readonly appointmentService: AppointmentService,
    @Inject(AppService)
    private readonly appService: AppService,
  ) {}

  @Post('create-appointment')
  async createAppointment(
    @Body() myAppointment: any,
    @Headers('authorization') authHeader: string,
  ) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      console.log(error);
      throw new HttpException('Not authorized', 401);
    }
    const verified = await this.appService.verifyAuth(token);
    if (verified.response) {
      return this.appointmentService.createAppointment(myAppointment);
    } else {
      console.log('Not identified.....');
      throw new HttpException('Not authorized', 401);
    }
  }

  @Get('get-all')
  async getAllAppointments(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('keyword') searchTerm: string,
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
      return this.appointmentService.getAllAppointments(
        page,
        limit,
        searchTerm,
      );
    } else {
      throw new HttpException('Not authorized', 401);
    }
  }

  @Put('update-appointment')
  async updateAppointment(
    @Headers('authorization') authHeader: string,
    @Query('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() appointmentData: any,
  ) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      throw new HttpException('Not authorized', 401);
    }
    const verified = await this.appService.verifyAuth(token);
    if (verified.response) {
      return this.appointmentService.updateAppointment(
        appointmentData,
        appointmentId,
      );
    } else {
      throw new HttpException('Not authorized', 401);
    }
  }
}
