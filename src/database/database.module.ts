import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nestjs-post-db')],
  providers: [DatabaseService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
