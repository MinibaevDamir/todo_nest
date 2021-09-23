import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('api/user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/login')
  login(@Body() data: LoginUserDto) {
    return this.userService.login(data);
  }
  @Post('/signup')
  signup(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
  @Get('/token')
  getNewToken(@Headers() headers) {
    return this.userService.getNewToken(headers.refreshtoken);
  }
  @Get('/logout')
  logout(@Headers() headers) {
    return this.userService.logout(headers.refreshtoken);
  }
  @Get('/get')
  findUser(@Query() query) {
    console.log(query.nickname);
    return this.userService.findUser(query.nickname);
  }
}
