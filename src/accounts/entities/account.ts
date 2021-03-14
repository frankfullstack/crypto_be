import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterInsert, AfterUpdate, AfterLoad } from "typeorm";
import { Statement } from "./statement";

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type:'varchar', length: 20 })
    accountName?: string;

    @Column({ type:'varchar', length: 20 })
    category?: string;

    @Column({ type:'varchar', length: 20 })
    tags?: string;

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
    balance?: number;

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
    availableBalance?: number;

    @OneToMany(() => Statement, statement => statement.account, { cascade: true })
    statements: Statement[];

}
