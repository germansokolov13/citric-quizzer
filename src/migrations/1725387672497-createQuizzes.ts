import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuizzes1725387672497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`
        CREATE TABLE quiz
        (
            id          SERIAL PRIMARY KEY,
            name        VARCHAR(300) NOT NULL,
            description TEXT         NOT NULL,
            created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP,
            deleted_at  TIMESTAMP,
            created_by  integer      NOT NULL,
            updated_by  integer,
            deleted_by  integer,
            UNIQUE (name)
        );

        CREATE TABLE quiz_question
        (
            id                 SERIAL PRIMARY KEY,
            content            TEXT      NOT NULL,
            quiz_id            integer   NOT NULL,
            original_id        integer   NOT NULL,
            version            integer   NOT NULL,
            answers            jsonb,
            is_multiple_choice boolean   NOT NULL,
            is_free_text       boolean   NOT NULL,
            created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by         integer   NOT NULL,
            superseded_at      TIMESTAMP,
            deleted_at         TIMESTAMP,
            deleted_by         integer,
            UNIQUE (original_id, version)
        );

        CREATE TABLE quiz_attempt
        (
            id          SERIAL PRIMARY KEY,
            quiz_id     integer   NOT NULL,
            user_id     integer   NOT NULL,
            started_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            finished_at TIMESTAMP          DEFAULT NULL
        );

        CREATE TABLE question_response
        (
            id                 SERIAL PRIMARY KEY,
            question_id        integer   NOT NULL,
            attempt_id         integer   NOT NULL,
            answers            jsonb,
            free_text_response TEXT,
            created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at         TIMESTAMP          DEFAULT NULL,
            UNIQUE (question_id, attempt_id)
        );

        ALTER TABLE quiz
            ADD CONSTRAINT fk_created_by
                FOREIGN KEY (created_by) REFERENCES user_account (id),
            ADD CONSTRAINT fk_updated_by
                FOREIGN KEY (updated_by) REFERENCES user_account (id),
            ADD CONSTRAINT fk_deleted_by
                FOREIGN KEY (deleted_by) REFERENCES user_account (id);

        ALTER TABLE quiz_question
            ADD CONSTRAINT fk_quiz
                FOREIGN KEY (quiz_id) REFERENCES quiz (id),
            ADD CONSTRAINT fk_original
                FOREIGN KEY (original_id) REFERENCES quiz_question (id),
            ADD CONSTRAINT fk_created_by
                FOREIGN KEY (created_by) REFERENCES user_account (id),
            ADD CONSTRAINT fk_deleted_by
                FOREIGN KEY (deleted_by) REFERENCES user_account (id);

        ALTER TABLE quiz_attempt
            ADD CONSTRAINT fk_quiz
                FOREIGN KEY (quiz_id) REFERENCES quiz (id),
            ADD CONSTRAINT fk_user
                FOREIGN KEY (user_id) REFERENCES user_account (id);

        ALTER TABLE question_response
            ADD CONSTRAINT fk_question
                FOREIGN KEY (question_id) REFERENCES quiz_question (id),
            ADD CONSTRAINT fk_attempt
                FOREIGN KEY (attempt_id) REFERENCES quiz_attempt (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
