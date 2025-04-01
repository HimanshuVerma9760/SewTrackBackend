import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Customers from 'src/Models/customer.model';
import CreateCustomerDTO, { EditCustomerDTO } from './dto/customer.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export default class CustomersService {
  constructor(
    @InjectModel(Customers) private readonly customerModel: typeof Customers,
  ) {}

  async getAllCustomers(page: number, limit: number, keyword: string) {
    const offset = (page - 1) * limit;
    let whereCondition = {};

    if (keyword && keyword.trim().length > 0) {
      whereCondition[Op.or] = [
        { customerId: { [Op.like]: `%${keyword}%` } },
        { name: { [Op.like]: `%${keyword}%` } },
        { phoneNumber: { [Op.like]: `%${keyword}%` } },
        { notes: { [Op.like]: `%${keyword}%` } },
      ];
    }

    try {
      const { rows, count } = await this.customerModel.findAndCountAll({
        offset,
        limit,
        where: whereCondition,
        include: { all: true },
      });
      if (rows) {
        return {
          response: true,
          statusCode: 200,
          message: 'Fetched all customers',
          result: rows,
          totalRecords: count,
        };
      } else {
        throw new HttpException('Error occured', 500);
      }
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async verifyCustomerId(custId: string) {
    try {
      const existingId = await this.customerModel.findAll({
        where: {
          customerId: custId,
        },
      });
      if (existingId.length === 0) {
        return {
          response: true,
          statusCode: 200,
          message: 'Customer Id accepted!',
        };
      } else {
        throw new HttpException('Duplicate customer Id', HttpStatus.AMBIGUOUS);
      }
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('Internal server error: ', 500);
    }
  }

  async editCustomer(customerData: EditCustomerDTO) {
    const exsistingCustomerEmail = await this.customerModel.findAll({
      where: {
        email: customerData.email,
      },
    });
    if (exsistingCustomerEmail.length > 1) {
      throw new HttpException('Customer already exist', HttpStatus.AMBIGUOUS);
    } else if (exsistingCustomerEmail.length === 1) {
      if (exsistingCustomerEmail[0].customerId !== customerData.customerId) {
        throw new HttpException(
          'Customer already exsist',
          HttpStatus.AMBIGUOUS,
        );
      }
    }
    const exsistingCustomerPhone = await this.customerModel.findAll({
      where: {
        phoneNumber: customerData.phoneNumber,
      },
    });
    if (exsistingCustomerPhone.length > 1) {
      throw new HttpException('Customer already exsist', HttpStatus.AMBIGUOUS);
    } else if (exsistingCustomerPhone.length === 1) {
      if (exsistingCustomerPhone[0].customerId !== customerData.customerId) {
        throw new HttpException(
          'Customer already exsist',
          HttpStatus.AMBIGUOUS,
        );
      }
    }
    try {
      const myCustomer = await this.customerModel.findAll({
        where: {
          customerId: customerData.customerId,
        },
      });
      if (myCustomer.length === 0) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const result = await myCustomer[0].update(customerData as any);
      if (result) {
        return {
          response: 'Success',
          statusCode: 202,
          message: 'Customer updated successfully',
        };
      } else {
        throw new HttpException('Customer could not be updated', 500);
      }
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('Customer could not be updated', 500);
    }
  }

  async addCustomer(customerData: CreateCustomerDTO) {
    const exsistingCustomerEmail = await this.customerModel.findAll({
      where: {
        email: customerData.email,
      },
    });
    if (exsistingCustomerEmail.length > 0) {
      throw new HttpException('Customer already exsist', HttpStatus.AMBIGUOUS);
    } else {
      const exsistingCustomerPhone = await this.customerModel.findAll({
        where: {
          phoneNumber: customerData.phoneNumber,
        },
      });
      if (exsistingCustomerPhone.length > 0) {
        throw new HttpException(
          'Customer already exsist',
          HttpStatus.AMBIGUOUS,
        );
      }
    }
    try {
      const result = await this.customerModel.create(customerData as any);
      if (result) {
        return {
          response: 'Success',
          statusCode: 202,
          message: 'Customer added successfully',
        };
      } else {
        throw new HttpException('Customer could not be added', 500);
      }
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('Customer could not be added', 500);
    }
  }

  async getCustomers() {
    try {
      const result = await this.customerModel.findAll({
        include: { all: true },
      });
      if (result) {
        return {
          response: 'Success',
          statusCode: 200,
          message: 'Customer fetched successfully',
          result,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
