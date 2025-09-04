import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './entity/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; userData: User } | null> {
    const { name, email } = createUserDto;
    try {
      const existingUser = await this.userRepository.findOneBy({
        email,
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Creating a new user in the database
      const newUser = await this.userRepository.create({
        email: email,
        name: name,
      });
      const newUserCheck = await this.userRepository.save(newUser);

      // Returning the user data
      return { message: 'User created successfully', userData: newUserCheck };
    } catch (error) {
      console.error('Error creating user:', error.message, error.stack);
      throw new Error(`Error creating new user: ${error.message}`);
    }
  }

  async findAllUsers(): Promise<{ users: User[]; count: number } | null> {
    try {
      const [users, count] = await this.userRepository.findAndCount();
      if (count == 0) {
        throw new Error('No users found. Please add users and try again.');
      }
      return { users, count };
    } catch (error) {
      console.error('Error finding users:', error.message, error.stack);
      throw new Error(`Error finding users: ${error.message}`);
    }
  }
}
