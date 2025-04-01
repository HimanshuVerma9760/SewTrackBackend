import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export default class CreateCustomerDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10, { message: 'Phone number cannot have more then 10 digits' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  notes: string;
}

export class EditCustomerDTO { 
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10, { message: 'Phone number cannot have more then 10 digits' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  notes: string;
}
