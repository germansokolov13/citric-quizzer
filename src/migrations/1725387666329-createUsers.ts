import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1725387666329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`
        CREATE TABLE user_account (
          id SERIAL PRIMARY KEY,
          name varchar(300) NOT NULL,
          hash TEXT DEFAULT NULL,
          is_admin boolean DEFAULT FALSE,
          email varchar(300) NOT NULL,
          UNIQUE (email)
        );

        CREATE TABLE access_role (
          id SERIAL PRIMARY KEY,
          name varchar(300) NOT NULL,
          UNIQUE (name)
        );

        CREATE TABLE user_role (
          id SERIAL PRIMARY KEY,
          user_id integer NOT NULL,
          role_id integer NOT NULL,
          UNIQUE (user_id, role_id)
        );

        CREATE TABLE permission (
          id SERIAL PRIMARY KEY,
          quiz_id integer NOT NULL,
          role_id integer DEFAULT NULL,
          user_id integer DEFAULT NULL,
          action varchar(300) NOT NULL
        );

        CREATE UNIQUE INDEX idx_permission_uniq ON permission(quiz_id, role_id, user_id, action) NULLS NOT DISTINCT;

        ALTER TABLE user_role
            ADD CONSTRAINT fk_user
                FOREIGN KEY (user_id) REFERENCES user_account(id),
            ADD CONSTRAINT fk_role
                FOREIGN KEY (role_id) REFERENCES access_role(id);

        ALTER TABLE permission
            ADD CONSTRAINT fk_role
                FOREIGN KEY (role_id) REFERENCES access_role(id),
            ADD CONSTRAINT fk_user
                FOREIGN KEY (user_id) REFERENCES user_account(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`
      DROP TABLE permission;
      DROP TABLE user_role;
      DROP TABLE access_role;
      DROP TABLE user_account;
    `);
  }
}
