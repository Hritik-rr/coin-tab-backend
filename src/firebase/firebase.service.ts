import * as admin from 'firebase-admin';

export class FirebaseService {
  constructor(private readonly app: admin.app.App) {}

  get auth(): admin.auth.Auth {
    if (!this.app) {
      throw new Error('Firebase app is not initialized');
    }
    return this.app.auth();
  }
}
