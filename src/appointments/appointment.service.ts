import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import Appointments from 'src/Models/appointment.model';
import AppointmentItems from 'src/Models/appointmentItem.model';
import Customers from 'src/Models/customer.model';
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
          { '$customer.name$': { [Op.like]: `%${searchTerm}%` } },
          { notes: { [Op.like]: `%${searchTerm}%` } },
          { totalPrice: { [Op.like]: `%${searchTerm}%` } },
        ];
      }
      const { rows, count } = await this.appointmentModel.findAndCountAll({
        offset,
        limit,
        where: whereCondition,
        include: [{ model: Customers, as: 'customer', required: true }],
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
      myAppointment.appointmentData.customerId =
        myAppointment.appointmentData.customerId * 1;
      // console.log('appointmentItemsData.....', myAppointment.items);
      const appointmentResult = await this.appointmentModel.create(
        myAppointment.appointmentData,
        { transaction },
      );
      for (let i = 0; i < myAppointment.items.length; i++) {
        let item = {
          item: myAppointment.items[i].item.name,
          price: myAppointment.items[i].item.price,
          qty: myAppointment.items[i].item.qty,
          totalPrice: myAppointment.items[i].item.itemTotalPrice,
          appointmentId: Number(appointmentResult.id),
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

  async updateAppointment(appointmentData: any, appointmentId: number) {
    const transaction = await this.sequelize.transaction();
    console.log('AppointmentId..........', appointmentId);
    try {
      appointmentData.appointmentData.customerId = Number(
        appointmentData.appointmentData.customerId,
      );

      const appointments = await this.appointmentModel.findAll({
        where: { id: appointmentId },
        transaction,
      });

      if (appointments.length !== 1) {
        throw new HttpException(
          'Appointment not found or multiple appointments returned.',
          HttpStatus.AMBIGUOUS,
        );
      }

      const updatedAppointment = await appointments[0].update(
        appointmentData.appointmentData,
        { transaction },
      );

      if (!updatedAppointment) {
        throw new Error('Failed to update appointment.');
      }

      const appointmentItems = await this.appointmentItemsModel.findAll({
        where: { appointmentId },
        transaction,
      });

      if (appointmentItems.length !== appointmentData.items.length) {
        throw new Error(
          'Mismatch between appointment items and provided items data.',
        );
      }

      await Promise.all(
        appointmentItems.map((eachItem, index) => {
          const itemData = {
            item: appointmentData.items[index].item.name,
            price: appointmentData.items[index].item.price,
            qty: appointmentData.items[index].item.qty,
            totalPrice: appointmentData.items[index].item.itemTotalPrice,
            appointmentId,
          };
          return eachItem.update(itemData as any, { transaction });
        }),
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
