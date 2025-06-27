import { BadRequestException, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schemas';
import { Error, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John Doe', email: 'jhon@gmail.com', role: 'admin' },
    { id: 2, name: 'Jane Doe', email: 'Jane@gmail.com', role: 'user' },
    { id: 3, name: 'Jim Doe', email: 'Jim@gmail.com', role: 'user' },
    { id: 4, name: 'Jack Doe', email: 'Jack@gmail.com', role: 'user' },
    { id: 5, name: 'Jill Doe', email: 'Jill@gmail.com', role: 'user' },
  ];

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(role?: string) {
    const users = await this.userModel
      .find(role ? { role } : {})
      .select('-password')
      .exec();
    return users;
  }

  async findById(id: number): Promise<{
    name: string;
    email: string;
    role: string;
  } | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const userExsists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    console.log('userExsists', userExsists);
    if (userExsists) {
      throw new BadRequestException('User already exists');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await newUser.save();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const exists = await this.userModel.findById(id);
    if (!exists) {
      throw new Error('User not found');
    }
    return await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .select('-password');
  }

  delete(id): { id: number; name: string; email: string; role: string }[] {
    const user = this.users.filter((user) => user.id !== id);
    return user;
  }

  async login(user: { email: string; password: string }) {
    const dbUser = await this.userModel.findOne({ email: user.email });
    if (!dbUser) {
      throw new BadRequestException("User doesn't exists");
    }

    if (await bcrypt.compare(user.password, dbUser.password)) {
      const payload = { email: dbUser.email, name: dbUser.name };
      console.log('🚀 ~ UsersService ~ login ~ payload:', payload);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException('Invalid Credentias!!!!');
    }
  }
}
