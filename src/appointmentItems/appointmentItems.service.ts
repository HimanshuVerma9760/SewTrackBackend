import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import AppointmentItems from 'src/Models/appointmentItem.model';

@Injectable()
export default class AppointmentItemsSevice {
  constructor(
    @InjectModel(AppointmentItems)
    private readonly appointmentItemsModel: typeof AppointmentItems,
  ) {}

  async getAllAppointmentItems(appointmentId: number) {
    const result = await this.appointmentItemsModel.findAll({
      where: {
        appointmentId: appointmentId,
      },
    });
    if (result.length !== 0) {
      return {
        response: 'Success',
        message: 'Successfully fetched appointment items',
        statusCode: 202,
        result,
      };
    } else {
      throw new HttpException(
        'Not valid appointment id',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
