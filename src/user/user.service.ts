import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LikedTrackCreateInput } from 'src/Dto/playlistDto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //create a user
  async signup(username: string, email: string, password: string) {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new Error('user already exist');
    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });
  }

  // signin
  async signin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }
  //find user by email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // add track to a user's liked tracks

  async addLikedTrack(data: LikedTrackCreateInput) {
    //check if user and track exist before attemting to create the join

    const userExsits = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExsits) {
      throw new Error(`user with Id ${data.userId} dose not exsit`);
    }

    const trackExsits = await this.prisma.track.findUnique({
      where: { id: data.trackId },
    });

    if (!trackExsits) {
      throw new Error(`track with ID ${data.trackId} dose not exsit`);
    }
    // check if the user has already liked the track
    const existingLiking = await this.prisma.favorites.findUnique({
      where: {
        userId_trackId: {
          userId: data.userId,
          trackId: data.trackId,
        },
      },
    });
    if (existingLiking) {
      throw new ConflictException('User has already liked this track');
    }
    return this.prisma.favorites.create({
      data: {
        userId: data.userId, // Keep userId as it's a required field
        trackId: data.trackId, // Track ID as string
      },
    });
  }

  // add track to a user's liked tracks

  async deleteLikedTrack(userId: string, trackId: string) {
    //check if user and track exist before attemting to create the join

    const userExsits = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExsits) {
      throw new Error(`user with Id ${userId} dose not exsit`);
    }

    const trackExsits = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!trackExsits) {
      throw new Error(`track with ID ${trackId} dose not exsit`);
    }
    return this.prisma.favorites.deleteMany({
      where: {
        userId,
        trackId,
      },
    });
  }
  //get track like by the user

  async getTracksLikedByUser(userId: string) {
    // check if user exist
    const userEsxit = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userEsxit) {
      throw new NotFoundException(`user with Id ${userId} dose not exist`);
    }
    const likedTracks = await this.prisma.favorites.findMany({
      where: { userId },
      include: {
        track: true,
      },
    });
    return likedTracks.map((likedTrack) => likedTrack.track);
  }
}
