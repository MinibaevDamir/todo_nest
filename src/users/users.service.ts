// @ts-ignore

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { redisClient } from '../redis/redisClient';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}
  async create(userData: CreateUserDto) {
    const user = await User.findOne({ where: { nickname: userData.nickname } });
    if (!user) {
      bcrypt.hash(userData.password, 11, async (err, hash) => {
        userData.password = hash;
        const data = await User.create(userData);
        if (data) {
          return { message: 'User is successfully created' };
        } else {
          throw new HttpException(
            'Can`t create object',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    } else
      throw new HttpException('User is already exist', HttpStatus.BAD_REQUEST);
  }
  async login(data: LoginUserDto) {
    const user: any = await User.findOne({
      where: {
        nickname: data.nickname,
      },
    });
    if (await bcrypt.compare(data.password, user.password)) {
      const token = this.jwtService.sign(user.dataValues, {
        expiresIn: 300,
        secret: 'secret',
      });
      const refreshToken = this.jwtService.sign(user.dataValues, {
        expiresIn: 2592000,
        secret: 'refresh_todo',
      });
      redisClient.rpush(
        ['UserID' + user.dataValues.id, refreshToken],
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Token is succesfully added!');
          }
        },
      );
      let admin = false;

      switch (user.roleId) {
        case 2:
          admin = true;
          break;
      }
      return { token: token, refreshToken: refreshToken, admin: admin };
    }
    throw new UnauthorizedException({ error: 'Incorrect email or password' });
  }
  async getNewToken(refreshtoken: string) {
    if (refreshtoken) {
      const decoded = this.jwtService.verify(refreshtoken, {
        secret: 'refresh_todo',
      });
      const data = new Date().getTime();
      if (data > decoded.exp * 1000) {
        redisClient.lrem(
          'UserID' + decoded.id,
          0,
          refreshtoken,
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Token is succesfully removed!');
            }
          },
        );
        throw new HttpException('Token is expired!', HttpStatus.NOT_ACCEPTABLE);
      }
      redisClient.lrange('UserID' + decoded.id, 0, 100, (err, response) => {
        if (response.includes(refreshtoken)) {
          ['exp', 'iat'].forEach((e) => delete decoded[e]);
          const token = this.jwtService.sign(decoded, {
            secret: 'secret',
            expiresIn: 300,
          });
          return { token: token };
        } else {
          throw new HttpException(
            'Token is not exist in store',
            HttpStatus.GONE,
          );
        }
      });
    } else {
      throw new HttpException('Forbidden refresh!', HttpStatus.FORBIDDEN);
    }
  }
  async logout(refreshtoken: string) {
    const decoded = await this.jwtService.verify(refreshtoken, {
      secret: 'refresh_todo',
    });
    redisClient.lrem('UserID' + decoded.id, 0, refreshtoken, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Token is succesfully removed!');
      }
    });
    return { message: 'Success!' };
  }
  async findUser(nickname: string) {
    const data = await User.findAll({
      where: { nickname: { [Op.substring]: nickname } },
    });
    return data;
  }
}
