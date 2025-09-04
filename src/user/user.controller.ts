import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(FirebaseAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createUserDto: SignUpUserDto) {
    return this.userService.userSignUp(createUserDto);
  }

  // @UseGuards(FirebaseAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Get('all')
  findAll() {
    // console.log('findAll Triggered TESTING');
    return this.userService.findAll();
  }
}
