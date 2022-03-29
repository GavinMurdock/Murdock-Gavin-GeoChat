import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'server/entities/chat_room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,
  ) {}

  findAll(): Promise<ChatRoom[]> {
    return this.chatRoomsRepository.find();
  }

  findOne(id: number): Promise<ChatRoom> {
    return this.chatRoomsRepository.findOne(id);
  }

  async create(chatRoomPayload: any) {
    const chatRoom = new ChatRoom();
    chatRoom.name = chatRoomPayload.name;
    chatRoom.lat = chatRoomPayload.lat;
    chatRoom.long = chatRoomPayload.long;
    return this.chatRoomsRepository.save(chatRoom);
  }
}
