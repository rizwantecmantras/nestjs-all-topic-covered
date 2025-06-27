import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async getUsers(
    @Query() query: { role?: string },
  ): Promise<{ name: string; email: string; role: string }[]> {
    const users = await this.userService.getUsers(query.role);
    return users;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.userService.findById(id);
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id,
  ): { id: number; name: string; email: string; role: string }[] {
    return this.userService.delete(+id);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body);
  }
}
