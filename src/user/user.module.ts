import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, FirebaseModule],
  providers: [UserService, AuthController],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
