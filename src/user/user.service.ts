import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignInUserDto } from './dto/sign-in.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthService } from 'src/auth/auth.service';
import { MockLoginResponse } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService,
  ) {}

  async userSignUp({ name, email, password }: SignUpUserDto): Promise<{
    message: string;
    userData: User;
    tokenData: MockLoginResponse;
  }> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email,
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Creating a new user in Firebase/ Updating Firebase record
      const firebaseNewUser = await this.firebaseService.auth.createUser({
        email: email,
        password: password,
      });

      const uid = firebaseNewUser.uid;

      // invoking the function mockLogin from auth.controller to get the idToken
      const idToken = await this.authService.mockLogin({ email, password });

      // Creating a new user in the database
      const newUser = this.userRepository.create({
        firebaseUid: uid,
        email: email,
        name: name,
      });
      const newUserCheck = await this.userRepository.save(newUser);

      // Returning the user data
      return {
        message: 'User created successfully',
        userData: newUserCheck,
        tokenData: idToken as MockLoginResponse,
      };
    } catch (error) {
      console.error('Error creating user:', error.message, error.stack);
      throw new Error(`Error creating new user: ${error.message}`);
    }
  }

  async userSignIn({ email, password }: SignInUserDto): Promise<{
    message: string;
    userData: User;
    tokenData: MockLoginResponse;
  }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.lockUntil && new Date() < user.lockUntil) {
      throw new UnauthorizedException('Account locked. Try again later.');
    }

    let idToken: any;
    try {
      idToken = await this.authService.mockLogin({ email, password });
    } catch (err) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      await this.userRepository.save(user);
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await this.userRepository.save(user);

    return {
      message: 'User signed in successfully',
      userData: user,
      tokenData: idToken as MockLoginResponse,
    };
  }

  async userSignOut(uid: string): Promise<{ message: string }> {
    try {
      await this.firebaseService.auth.revokeRefreshTokens(uid);
      return { message: 'User signed out successfully' };
    } catch (error) {
      console.error('Error signing out user:', error.message, error.stack);
      throw new Error(`Error signing out user: ${error.message}`);
    }
  }

  async findAll(): Promise<{ users: User[]; count: number }> {
    // console.log('findAll Triggered TESTING SERVICE');
    try {
      const [users, count] = await this.userRepository.findAndCount();

      if (count === 0) {
        throw new Error('User not available. Please try again.');
      }
      // Returning the users and the count(both within the same object) of users
      return { users, count };
    } catch (error) {
      console.error('Error finding the unique user:', error.message);
      throw new Error(`Error finding user. POSSIBLE ISSUE: ${error.message}`);
    }
  }
}
