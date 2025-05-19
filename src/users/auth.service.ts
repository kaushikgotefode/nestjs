import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const existingUser = await this.usersService.find(email);
    if (existingUser.length) {
      throw new BadRequestException('Email already in use');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    // const [_, passwordHash] = result.split('.');
    const user = await this.usersService.create(email, result);
    if (!user) {
      throw new BadRequestException('User not created');
    }
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
