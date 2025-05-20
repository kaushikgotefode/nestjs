import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/intercepters/serialize.intercepter';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: { userId?: number },
  ) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }
  @Get('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: { userId?: number },
  ) {
    const { email, password } = body;

    const user = await this.authService.signin(email, password);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    session.userId = user.id;
    return user;
  }

  // @Get('/currentuser')
  // whoAmI(@Session() session: { userId?: number }) {
  //   if (!session?.userId) {
  //     throw new NotFoundException('User ID not found in session');
  //   }
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/currentuser')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserDto) {
    return user;
  }

  @Get('/signout')
  signout(@Session() session: { userId?: number | null }) {
    session.userId = null;
    return { message: 'User signed out successfully' };
  }

  @Get('/users')
  async findAllUsers() {
    const users = await this.usersService.findAll();
    if (!users) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: Partial<CreateUserDto>,
  ) {
    const user = await this.usersService.update(parseInt(id), body);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.remove(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
