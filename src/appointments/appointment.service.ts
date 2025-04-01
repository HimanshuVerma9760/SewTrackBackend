import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import Appointments from 'src/Models/appointment.model';
import AppointmentItems from 'src/Models/appointmentItem.model';
import Users from 'src/Models/users.model';

@Injectable()
export default class AppointmentService {
  constructor(
    @InjectModel(Appointments)
    private readonly appointmentModel: typeof Appointments,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
    @InjectModel(AppointmentItems)
    private readonly appointmentItemsModel: typeof AppointmentItems,
  ) {}

  async getAllAppointments(page: number, limit: number, searchTerm: string) {
    try {
      const offset = (page - 1) * limit;
      let whereCondition = {};
      if (searchTerm || searchTerm.trim().length > 0) {
        whereCondition[Op.or] = [
          { '$user.name$': { [Op.like]: `%${searchTerm}%` } },
          { notes: { [Op.like]: `%${searchTerm}%` } },
          { totalPrice: { [Op.like]: `%${searchTerm}%` } },
        ];
      }
      const { rows, count } = await this.appointmentModel.findAndCountAll({
        offset,
        limit,
        where: whereCondition,
        include: [{ model: Users, as: 'user', required: true }],
      });
      return {
        response: 'Success',
        statusCode: 200,
        message: 'Successfully fetched Appointments',
        result: rows,
        totalRecords: count,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal Server error', 500);
    }
  }
  async createAppointment(myAppointment: any) {
    let appointmentItemResult: any;
    const transaction = await this.sequelize.transaction();
    try {
      const appointmentResult = await this.appointmentModel.create(
        myAppointment.appointmentData,
        { transaction },
      );
      for (let i = 0; i < myAppointment.items.length; i++) {
        let item = {
          item: myAppointment.items.item.name,
          price: myAppointment.items.item.price,
          qty: myAppointment.items.item.qty,
          totalPrice: myAppointment.items.item.itemTotalPrice,
          appointmentId: appointmentResult.id,
        };
        appointmentItemResult = await this.appointmentItemsModel.create(
          item as any,
          { transaction },
        );
      }
      await transaction.commit();
      if (appointmentItemResult) {
        return {
          response: 'Success',
          statusCode: 202,
          message: 'Successfully created Appointment',
        };
      }
    } catch (error) {
      transaction.rollback();
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
