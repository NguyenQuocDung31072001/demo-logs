import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogsModules1724991501893 implements MigrationInterface {
    name = 'AddLogsModules1724991501893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT now(), "info" character varying NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
