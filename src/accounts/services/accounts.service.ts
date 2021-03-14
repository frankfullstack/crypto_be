import { AccountDto } from './../dto/account.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './../entities/account';
import { StatementDto } from '../dto/statement.dto';
import { Statement } from '../entities/statement';
import { Utils } from '../../shared/utils/utils';
import { exception } from 'console';

export const TRANSACTION_TYPES = [
    'Payment received',
    'Payment emmitted'
];

@Injectable()
export class AccountsService {
    constructor(@InjectRepository(Account) private accountsRepository: Repository<Account>,
        @InjectRepository(Statement) private statementsRepository: Repository<Statement>) { }

    findAll(): Promise<Account[]> {
        return this.accountsRepository.find();
    }

    async findOne(id: number): Promise<Account> {
        const account = await this.accountsRepository.findOne(id, { relations: ['statements'] });
        if (!account) {
            throw new NotFoundException(`Account #${id} not found`)
        }
        return account;
    }

    create(accountDto: AccountDto) {
        const account = this.accountsRepository.create(accountDto);
        return this.accountsRepository.save(account);
    }

    async update(id: number, accountDto: AccountDto) {
        const account = await this.accountsRepository.preload({
            id: +id,
            ...accountDto
        });

        if (!account) {
            throw new NotFoundException(`Account #${id} not found`)
        }

        return this.accountsRepository.save(account);
    }

    async getAllAccountsIds(): Promise<number[]> {
        const accountsList = await this.accountsRepository.find();
        if (accountsList && accountsList.length) {
            return [...accountsList].map(acc => acc.id);
        }
        return [];
    }

    async addStatement(accountId: number, statementDto: StatementDto) {
        let account = await this.accountsRepository.findOne(accountId, { relations: ['statements'] });
        // console.log(account, statementDto);
        if (!account) {
            throw new NotFoundException(`Account #${accountId} not found`)
        }
        const statement = new Statement();
        statement.confirmedDate = new Date();
        statement.orderId = statementDto.orderId;
        statement.orderCode = statementDto.orderCode;
        statement.type = statementDto.type
        statement.debit = statementDto.debit;
        statement.credit = statementDto.credit;
        statement.balance = (account.balance || 0) - statementDto.debit + statementDto.credit;
        account.balance = account.balance - statement.debit + statement.credit;
        account.availableBalance = account.availableBalance - statement.debit + statement.credit;
        account.statements.push(statement)
        await this.statementsRepository.save(statement);
        account = await this.accountsRepository.save(account);

        return account;
    }

    async insertStatementForRandomAccount() {
        try {
            const randomAccountId = Utils.getRandomArrayItem(await this.getAllAccountsIds());
            const randomItemType = TRANSACTION_TYPES[Utils.getRandomArrayItem(TRANSACTION_TYPES)];
            let account = await this.accountsRepository.findOne(randomAccountId, { relations: ['statements'] });
            const prevAccountValue: Account = Object.assign({}, account);
            let updatedAccountValue: Account;
            if (account) {
                const statement = new Statement();
                statement.confirmedDate = new Date();
                statement.orderId = Utils.generateRandomString(4);
                statement.orderCode = Utils.generateRandomString(4);
                statement.type = randomItemType;
                statement.debit = (randomItemType === 'Payment received') ? 0 : Utils.generateRandomNumber(0, 1, 10);
                statement.credit = (randomItemType === 'Payment emmitted') ? 0 : Utils.generateRandomNumber(0, 1, 10);
                statement.balance = (account.balance || 0) - statement.debit + statement.credit;
                account.balance = account.balance - statement.debit + statement.credit;
                account.availableBalance = (account.availableBalance - statement.debit + statement.credit) * .9;
                account.statements.push(statement)
                await this.statementsRepository.save(statement);
                await this.accountsRepository.save(account);
                updatedAccountValue = Object.assign({}, account);
                delete prevAccountValue.statements;
                delete updatedAccountValue.statements;
                return {
                    prevAccountValue,
                    updatedAccountValue,
                    statement,
                    accountId: account.id
                };
            }
        } catch (error) {
            throw new exception('The Statement was not inserted');
        }
    }

    async delete(id: number) {
        const account = await this.accountsRepository.findOne(id);
        return this.accountsRepository.remove(account);
    }


}
