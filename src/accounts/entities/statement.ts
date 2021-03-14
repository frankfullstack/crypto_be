import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";
import { Account } from "./account";

@Entity()
export class Statement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, account => account.statements)
    account: Account;

    @Column()
    confirmedDate: Date;

    @Column({ type:'varchar', length: 10 })
    orderId: string;

    @Column({ type:'varchar', length: 10 })
    orderCode: string;

    @Column({ type:'varchar', length: 25 })
    type?: string;

    @Column({
        type: 'decimal', precision: 20, scale: 10, transformer: {
            to(value) {
                return value;
            },
            from(value) {
                return parseFloat(value);
            },
        }
    })
    debit: number;

    @Column({
        type: 'decimal', precision: 20, scale: 10, transformer: {
            to(value) {
                return value;
            },
            from(value) {
                return parseFloat(value);
            },
        }
    })
    credit: number;

    @Column({
        type: 'decimal', precision: 20, scale: 10, transformer: {
            to(value) {
                return value;
            },
            from(value) {
                return parseFloat(value);
            },
        }
    })
    balance: number;

}