import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports:[
  ClientsModule.register([
    {
      name: 'USER_MS',
      transport: Transport.GRPC,
      options: {
        package: 'userms',
        protoPath: join(__dirname, '../../proto/user-app.proto'),
        url: 'localhost:3001',
      },
    },
  ]),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [ClientsModule, CommonService],
})
export class CommonModule {}
