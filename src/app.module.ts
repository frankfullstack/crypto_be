import { SharedModule } from './shared/shared.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// Gateways
import { AppGateway } from './gateways/app.gateway';

// Feature Modules
import { AccountsModule } from './accounts/accounts.module';

// Entities
import { Account } from './accounts/entities/account';
import { Statement } from './accounts/entities/statement';

@Module({
  imports: [
    SharedModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin1234',
      database: 'tn-accounts',
      entities: [Account, Statement],
      synchronize: true,
    }),
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway
  ],
})
export class AppModule { }
