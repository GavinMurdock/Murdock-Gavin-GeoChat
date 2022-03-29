import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddChatRoom1648499682146 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_room',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'lat',
            type: 'decimal(8,6)',
          },
          {
            name: 'long',
            type: 'decimal(9,6)',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_room');
  }
}
