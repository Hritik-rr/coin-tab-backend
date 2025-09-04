import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import axios from 'axios';

// Simulating login with Firebase Auth for the frontend step
// Ideally, the frontend would sign in with Firebase Auth and then call this endpoint to get a custom token
// The custom token then goes to the backend with this custom token and exchange it for a Firebase ID token(JWT)
// Then the backend would validate the ID token and return the user data

// UID(Gets generated from jwt(firebase) Auth when new user signs up) → createCustomToken(from uid) → (exchange via Firebase) → ID Token (JWT).
@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('mock-login')
  async mockLogin(@Query('uid') uid: string) {
    const customToken = await this.firebaseService.auth.createCustomToken(
      uid || 'test-user-123',
    );
    // Exchange custom token for ID token via Firebase REST API using Axios
    const apiKey = process.env.FIREBASE_WEB_API_KEY; // from your Firebase project settings
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;

    const res = await axios.post(url, {
      token: customToken,
      returnSecureToken: true,
    });
    // idToken is the Firebase ID token (JWT)
    const idToken = res.data.idToken; // this is what verifyIdToken() expects
    // console.log('idToken', idToken);
    return {
      idToken: res.data.idToken,
      refreshToken: res.data.refreshToken,
      expiresIn: res.data.expiresIn,
    };
  }
}
