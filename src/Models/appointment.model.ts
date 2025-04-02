import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Customers from './customer.model';

@Table({ tableName: 'Appointments', timestamps: true })
export default class Appointments extends Model<Appointments> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  suitsQty: number;

  @ForeignKey(() => Customers)
  @Column({ type: DataType.INTEGER, allowNull: false })
  customerId: number;

  @BelongsTo(() => Customers)
  customer: Customers;

  @Column({ type: DataType.STRING, allowNull: false })
  notes: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalPrice: number;

  @Column({ type: DataType.DATE, allowNull: false })
  deliveryDate: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isDelivered: boolean;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  deletedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  createdAt?: any;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  updatedAt?: any;
}
