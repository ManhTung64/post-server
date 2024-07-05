import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GroupController } from './group.controller';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '180d' },
    }),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
})
export class GroupModule {}
