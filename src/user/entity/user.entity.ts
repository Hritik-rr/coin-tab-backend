import { IsEmail } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
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
