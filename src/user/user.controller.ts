import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LikedTrackCreateInput } from 'src/Dto/playlistDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.userService.signup(body.username, body.email, body.password);
  }

  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    return this.userService.signin(body.email, body.password);
  }
  @Get('findByEmail')
  async findUserByEmail(@Query('email') email: string) {
    if (!email) {
      return { message: 'Email query parameter is required' };
    }

    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }
  // add liked tracks by user
  @Post(':userId/like/:trackId')
  async addLikedTrack(
    @Param('userId') userId: string,
    @Param('trackId') trackId: string,
    @Body() body: LikedTrackCreateInput, // Expect body with additional fields
  ) {
    // Assign userId and trackId from params to the body
    body.userId = userId;
    body.trackId = trackId;

    return this.userService.addLikedTrack(body);
  }

  // un liked tracks by user
  @Delete(':userId/unlike/:trackId')
  async deleteLikedTrack(
    @Param('userId') userId: string,
    @Param('trackId') trackId: string,
  ) {
    return this.userService.deleteLikedTrack(userId, trackId);
  }
  // det tacks like by user
  @Get(':userId/likedTrack')
  async getTracksLikedByUser(@Param('userId') userId: string) {
    return this.userService.getTracksLikedByUser(userId);
  }
}
