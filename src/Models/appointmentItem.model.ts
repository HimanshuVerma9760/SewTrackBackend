import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Appointments from './appointment.model';

@Table({ tableName: 'appointmentItems', timestamps: true })
export default class AppointmentItems extends Model<AppointmentItems> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  item: string;
  @Column({ type: DataType.INTEGER, allowNull: false })
  qty: number;
  @Column({ type: DataType.INTEGER, allowNull: false })
  price: number;
  @Column({ type: DataType.INTEGER, allowNull: false })
  totalPrice: number;

  @ForeignKey(() => Appointments)
  @Column({ type: DataType.INTEGER, allowNull: false })
  appointmentId: number;
  @BelongsTo(() => Appointments)
  appointment: Appointments;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  deletedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  createdAt?: any;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  updatedAt?: any;
}
