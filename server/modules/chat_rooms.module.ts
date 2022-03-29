import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsController } from 'server/controllers/chat_rooms.controller';
import { ChatRoom } from 'server/entities/chat_room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom])],
  controllers: [ChatRoomsController],
  providers: [],
  exports: [],
})
export class ChatRoomsModule {}
