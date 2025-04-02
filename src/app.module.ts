import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import Users from './Models/users.model';
import Customers from './Models/customer.model';
import CustomersController from './customers/customers.controller';
import CustomersService from './customers/customers.service';
import Appointments from './Models/appointment.model';
import AppointmentsController from './appointments/appointment.controller';
import AppointmentService from './appointments/appointment.service';
import AppointmentItems from './Models/appointmentItem.model';
import AppointmentItemsSevice from './appointmentItems/appointmentItems.service';
import AppointmentItemsController from './appointmentItems/appointmentItems.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      username: 'Himanshu9760',
      password: 'Himanshu2512@35412879',
      database: 'sew_track',
      models: [Users, Customers, Appointments, AppointmentItems],
      autoLoadModels: true,
      synchronize: false,
    }),
    SequelizeModule.forFeature([
      Users,
      Customers,
      Appointments,
      AppointmentItems,
    ]),
  ],
  controllers: [
    AppController,
    CustomersController,
    AppointmentsController,
    AppointmentItemsController,
  ],
  providers: [
    AppService,
    CustomersService,
    AppointmentService,
    AppointmentItemsSevice,
  ],
})
export class AppModule {}
