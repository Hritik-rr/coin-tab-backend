import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebase: FirebaseService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header = req.headers['authorization'] || '';

    // const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const parts = header.split(' ');
    // console.log('Auth parts:', parts);
    const token =
      parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : header; // assume header was just "<token>"
    // console.log('Token extracted:', token);

    if (!token) {
      throw new UnauthorizedException('No authorization header provided');
    }

    try {
      const decoded = await this.firebase.auth.verifyIdToken(token);
      // console.log('Token decoded successfully:', decoded);
      req.user = decoded; // attach decoded Firebase user (uid, email, etc.)
      return true;
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      // Check if it's an expiration error
      if (error.code === 'auth/id-token-expired') {
        throw new UnauthorizedException(
          'Token has expired. Please get a new token from /auth/mock-login',
        );
      }
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}
