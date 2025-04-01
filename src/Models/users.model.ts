import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'users', timestamps: true })
export default class Users extends Model<Users> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phoneNumber: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  deletedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  createdAt?: any;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now() })
  updatedAt?: any;
}
