import { Injectable } from '@nestjs/common';
import axios from 'axios';

// Simulating login with Firebase Auth for the frontend step
// Ideally, the frontend would sign in with Firebase Auth and then call this endpoint to get a custom token
// The custom token then goes to the backend with this custom token and exchange it for a Firebase ID token(JWT)
// Then the backend would validate the ID token and return the user data

// UID(Gets generated from jwt(firebase) Auth when new user signs up) → createCustomToken(from uid) → (exchange via Firebase) → ID Token (JWT).
export interface MockLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
@Injectable()
export class AuthService {
  async mockLogin({ email, password }): Promise<MockLoginResponse | null> {
    // Use signInWithPassword endpoint for login
    const apiKey = process.env.FIREBASE_WEB_API_KEY; // from your Firebase project settings
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const res = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
    // idToken is the Firebase ID token (JWT)
    if (res) {
      return {
        idToken: res.data.idToken,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
      };
    }
    return null;
  }
}
