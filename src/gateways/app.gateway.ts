import { AccountsService } from './../accounts/services/accounts.service';
import { Utils } from './../shared/utils/utils';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { Interval } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private server: Server;
  private clients: Socket[] = [];
  
  private readonly newExchangeRateDescriptor: string = 'new-exchange-rate';
  private readonly newStatementDescriptor: string = 'new-statement';
  private readonly minConversionRateValue: number = 5000;
  private readonly maxConversionRateValue: number = 12000;
  private readonly decimalPlaces: number = 10;

  private readonly logger = new Logger('AppGateway');

  constructor(private accountsService: AccountsService) {
    
  }
  
  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.clients.push(client);
    const newConversionRate = this.generateConversionRate(this.minConversionRateValue, this.maxConversionRateValue, this.decimalPlaces);
    client.emit(this.newExchangeRateDescriptor, newConversionRate);
  }
  
  handleDisconnect(client: Socket) {
    const clientIndex = this.clients.findIndex(c => c.id === client.id);
    if (clientIndex !== -1) {
      this.clients.splice(clientIndex, 1);
    }
  }
  
  @Interval(3000)
  public handleRateVariation() {
    const conversionRate = this.generateConversionRate(this.minConversionRateValue, this.maxConversionRateValue, this.decimalPlaces);
    this.clients.forEach((client: Socket) => {
      client.emit(this.newExchangeRateDescriptor, conversionRate);
    });
  }

  @Interval(25000)
  public async showAccountIds() {
    const accountAffected = await this.accountsService.insertStatementForRandomAccount();
    this.clients.forEach((client: Socket) => {
      client.emit(this.newStatementDescriptor, accountAffected);
    })

  }

  private generateConversionRate(min, max, decimalPlaces) {
    return Utils.generateRandomNumber(min, max, decimalPlaces);
  }
}
