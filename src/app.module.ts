import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import { EventLoggerModule } from './event-logger/event-logger.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    DoctorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventLoggerModule,
    CommonModule,
    UserModule,
    PermissionModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
