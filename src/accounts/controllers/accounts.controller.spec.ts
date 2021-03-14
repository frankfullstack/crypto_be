import { Statement } from './../entities/statement';
import { Utils } from './../../shared/utils/utils';
import { AccountsService } from './../services/accounts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { Account } from '../entities/account';
import { getRepositoryToken } from '@nestjs/typeorm';

export const MOCK_DATA: Account[] = [
  {
    "id": 1,
    "accountName": "BTC Account 1",
    "category": "Personal Account",
    "tags": "BCT",
    "balance": 1.5078489013,
    "availableBalance": 1.249292301,
    "statements": []
  }
]

export const MOCK_STATEMENT: Statement = {
  "id": 73,
  "confirmedDate": new Date("2021-03-14T13:27:09.000Z"),
  "orderId": "NTGI",
  "orderCode": "VPYD",
  "type": "Payment emmitted",
  "debit": 0.1593810493,
  "credit": 0,
  "balance": -0.1593810493,
  "account": null
}

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: AccountsService;

  const mockedRepo = {
    // mock the repo `findOneOrFail`
    findOneOrFail: jest.fn(() => Promise.resolve(MOCK_DATA[0])),
  };

  const mockStatementRepo = {
    findOneOrFail: jest.fn(() => Promise.resolve(MOCK_STATEMENT)),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockedRepo,
        },
        {
          provide: getRepositoryToken(Statement),
          useValue: mockStatementRepo,
        },
      ]
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });


  it('should return an array of accounts',async () => {
    const result = Promise.resolve(MOCK_DATA);

    await jest.spyOn(accountsService, 'findAll').mockImplementation(() => result);

    let controllerResult = await controller.findAll();

    expect(controllerResult.length).toBe(1);
  });
});
