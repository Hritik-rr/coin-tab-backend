import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  imports: [FirebaseModule],
  providers: [FirebaseAuthGuard, AuthService],
  exports: [FirebaseAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
