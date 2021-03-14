import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsController } from './controllers/accounts.controller';
import { AccountsService } from './services/accounts.service';

// Entities
import { Account } from './entities/account';
import { Statement } from './entities/statement';

@Module({
  controllers: [AccountsController],
  imports: [TypeOrmModule.forFeature([Account, Statement])],
  providers: [AccountsService],
  exports: [AccountsService]
})
export class AccountsModule {}
