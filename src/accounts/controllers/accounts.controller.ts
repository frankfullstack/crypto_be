import { AccountDto } from './../dto/account.dto';
import { AccountsService } from './../services/accounts.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { StatementDto } from '../dto/statement.dto';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Get()
    async findAll() {
        return await this.accountsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.accountsService.findOne(id);
    }

    @Post()
    async create(@Body() account: AccountDto) {
        return await this.accountsService.create(account);
    }

    @Put(':id')
    async update(@Param('id') id: number, accountDto: AccountDto) {
        return await this.accountsService.update(id, accountDto);
    }

    @Post(':id/statements')
    async createComment(@Param('id') id: number, @Body() statementDto: StatementDto) {
        return await this.accountsService.addStatement(id, statementDto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.accountsService.delete(id);
    }
}
