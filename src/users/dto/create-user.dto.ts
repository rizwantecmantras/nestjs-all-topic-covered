import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
export default CreateUserDto;
