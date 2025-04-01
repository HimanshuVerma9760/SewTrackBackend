import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import Users from './Models/users.model';
import Customers from './Models/customer.model';

@Injectable()
export class AppService {
  constructor(@InjectModel(Users) private readonly usersModel: typeof Users,
  @InjectModel(Customers) private readonly customersModel: typeof Customers
) {}
  getHello(): string {
    return 'Hello World!';
  }

  async login(loginCred: any) {
    console.log('loginCred: ', loginCred);
    try {
      const exsistingTailor = await this.usersModel.findOne({
        where: {
          phoneNumber: loginCred.phone,
        },
      });
      if (exsistingTailor) {
        console.log('user exsist');
        const verifiedTailor = await bcrypt.compare(
          loginCred.password,
          exsistingTailor.password,
        );
        if (verifiedTailor) {
          console.log('user verified');
          const token = jwt.sign(
            {
              id: exsistingTailor.id,
              name: exsistingTailor.name,
              phone: exsistingTailor.phoneNumber,
            },
            process.env.USER_KEY,
            { expiresIn: '1h' },
          );
          return {
            response: 'Success',
            statusCode: HttpStatus.ACCEPTED,
            message: 'Login successfull',
            token,
          };
        } else {
          throw new HttpException('Not authorized', 401);
        }
      } else {
        throw new HttpException('Not authorized', 401);
      }
    } catch (error) {
      console.log('Some error occured while logging in!', error);
      throw new HttpException('Some error occured while logging in!', 500);
    }
  }
 
  async verifyAuth(token: string) {
    try {
      const verifiedUser = jwt.verify(token, process.env.USER_KEY);
      if (verifiedUser) {
        return {
          response: true,
          adminId: verifiedUser.id,
          name: verifiedUser.name,
        };
      } else {
        throw new HttpException('Not authorized', 401);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Not authorized', 401);
    }
  }
}
