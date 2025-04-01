import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Inject,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import CustomersService from './customers.service';
import { AppService } from 'src/app.service';
import CreateCustomerDTO, { EditCustomerDTO } from './dto/customer.dto';

@Controller('api/customers')
export default class CustomersController {
  constructor(
    @Inject(CustomersService)
    private readonly customerService: CustomersService,
    @Inject(AppService) private readonly appService: AppService,
  ) {}

  @Post('add-customer')
  async addCustomer(
    @Body() customerData: CreateCustomerDTO,
    @Headers('authorization') authHeader: string,
  ) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      throw new HttpException('Not authorized', 401);
    }
    const verified = await this.appService.verifyAuth(token);
    // console.log('Customer Data: ..........   ', customerData);
    if (verified.response) {
      return this.customerService.addCustomer(customerData);
    } else {
      throw new HttpException('Not authorized', 401);
    }
  }

  @Get('verifyCustomerId')
  async verifyUsername(
    @Query('customerId') custId: string,
    @Headers('authorization') authHeader: string,
  ) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      throw new HttpException('Not authorized', 401);
    }
    const verified = await this.appService.verifyAuth(token);
    if (verified.response) {
      return this.customerService.verifyCustomerId(custId);
    } else {
      throw new HttpException('Not authorized', 401);
    }
  }

  @Get('get-all')
  getAllCustomers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('keyword') keyword: string,
  ) {
    return this.customerService.getAllCustomers(page, limit, keyword);
  }

  @Get('get-customers')
  getCustomers() {
    return this.customerService.getCustomers();
  }

  @Put('edit-customer')
  async editCustomer(
    @Body() formData: EditCustomerDTO,
    @Headers('authorization') authHeader: string,
  ) {
    let token: string;
    try {
      token = authHeader.split(' ')[1];
    } catch (error) {
      throw new HttpException('Not authorized', 401);
    }
    const verified = await this.appService.verifyAuth(token);
    if (verified.response) {
      return this.customerService.editCustomer(formData);
    } else {
      throw new HttpException('Not authorized', 401);
    }
  }
}
