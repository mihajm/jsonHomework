import { Module } from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { DiseaseController } from './disease.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Disease])],
  providers: [DiseaseService],
  controllers: [DiseaseController],
  exports: [DiseaseService],
})
export class DiseaseModule {}
