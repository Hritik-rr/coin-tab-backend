import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SignInUserDto } from './dto/sign-in.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(FirebaseAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Post('sign-up')
  create(@Body() createUserDto: SignUpUserDto) {
    return this.userService.userSignUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.userService.userSignIn(signInUserDto);
  }

  @Post('sign-out/:uid')
  signOut(@Param('uid') uid: string) {
    return this.userService.userSignOut(uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('all')
  findAll() {
    // console.log('findAll Triggered TESTING');
    return this.userService.findAll();
  }
}
