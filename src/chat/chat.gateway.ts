import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server,Socket } from 'socket.io';
import { aTGuard } from '../common/guard/aT.guard';

@WebSocketGateway()
export class ChatGateway1 implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger:Logger=new Logger('ChatGateway')
  handleConnection(client: Socket) {
    client.join('room')
    
  }

  // Handles a user disconnection

  handleDisconnect(client: Socket) {
   
  }

sendMessageToUser(data:any){
  
  
}



  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(client.id)
 
    client.join(data['roomId'])
  this.server.to(data['roomId']).emit('cos',data)
  
  
   
    
}



}

