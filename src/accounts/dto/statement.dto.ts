import { Column } from "typeorm";

export class StatementDto {
    readonly confirmedDate: Date;
    readonly orderId: string;
    readonly orderCode: string;
    readonly type: string;
    readonly debit: number;
    readonly credit: number;
    readonly balance: number;
}