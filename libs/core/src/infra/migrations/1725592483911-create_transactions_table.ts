import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTransactionsTable1725592483911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
                CREATE TABLE account_transactions (
                    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
                    account_id integer NOT NULL,
                    kind character varying NOT NULL,
                    value numeric NOT NULL,
                    created_at timestamptz DEFAULT now(),
                    target_account_id integer,
                    CONSTRAINT account_transactions_pkey PRIMARY KEY (id)
                );
    
                ALTER TABLE account_transactions ADD CONSTRAINT account_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts(id);
                ALTER TABLE account_transactions ADD CONSTRAINT account_transactions_target_account_id_fkey FOREIGN KEY (target_account_id) REFERENCES accounts(id);
            `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
                DROP TABLE account_transactions;
            `)
  }
}
