import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAccountsTable1725501012501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE accounts (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
          name character varying NOT NULL,
          balance numeric NOT NULL,
          CONSTRAINT users_pkey PRIMARY KEY (id)
      );
  `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DROP TABLE users;
  `)
  }
}
