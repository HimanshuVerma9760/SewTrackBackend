import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'customers', timestamps: true })
export default class Customers extends Model<Customers> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  customerId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  address: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  notes: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  phoneNumber: number;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  deletedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  createdAt?: any;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  updatedAt?: any;
}
