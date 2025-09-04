import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Column({ nullable: true })
  firebaseUid: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Column({ nullable: true })
  password: string;
}
