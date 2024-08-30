import { MigrationInterface, QueryRunner } from "typeorm";

export class IntiDb1724990703729 implements MigrationInterface {
    name = 'IntiDb1724990703729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT now(), "full_name" character varying NOT NULL, "user_name" character varying NOT NULL, "password" character varying NOT NULL, "user_role_id" character varying, "role_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT now(), "name" character varying NOT NULL, "role_key" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rolesToActions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT now(), "role_id" integer, "action_id" integer, CONSTRAINT "PK_268f88c49359439ce32440d7144" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT now(), "name" character varying NOT NULL, "action_key" character varying NOT NULL, CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rolesToActions" ADD CONSTRAINT "FK_f3725a689907383e4d2aa9c3858" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rolesToActions" ADD CONSTRAINT "FK_244725e67f3f8a5032772d7727e" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rolesToActions" DROP CONSTRAINT "FK_244725e67f3f8a5032772d7727e"`);
        await queryRunner.query(`ALTER TABLE "rolesToActions" DROP CONSTRAINT "FK_f3725a689907383e4d2aa9c3858"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "actions"`);
        await queryRunner.query(`DROP TABLE "rolesToActions"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
