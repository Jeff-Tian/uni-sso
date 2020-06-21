create database df1aqs65o6mn0e;
-- Adminer 4.7.6 PostgreSQL dump

\connect "df1aqs65o6mn0e";

DROP TABLE IF EXISTS "user_entity";
CREATE TABLE "public"."user_entity" (
                                        "id" character varying(36) NOT NULL,
                                        "email" character varying(255),
                                        "email_constraint" character varying(255),
                                        "email_verified" boolean DEFAULT false NOT NULL,
                                        "enabled" boolean DEFAULT false NOT NULL,
                                        "federation_link" character varying(255),
                                        "first_name" character varying(255),
                                        "last_name" character varying(255),
                                        "realm_id" character varying(255),
                                        "username" character varying(255),
                                        "created_timestamp" bigint,
                                        "service_account_client_link" character varying(255),
                                        "not_before" integer DEFAULT '0' NOT NULL,
                                        CONSTRAINT "constraint_fb" PRIMARY KEY ("id"),
                                        CONSTRAINT "uk_dykn684sl8up1crfei6eckhd7" UNIQUE ("realm_id", "email_constraint"),
                                        CONSTRAINT "uk_ru8tt6t700s9v50bu18ws5ha6" UNIQUE ("realm_id", "username")
) WITH (oids = false);

CREATE INDEX "idx_user_email" ON "public"."user_entity" USING btree ("email");

INSERT INTO "user_entity" ("id", "email", "email_constraint", "email_verified", "enabled", "federation_link", "first_name", "last_name", "realm_id", "username", "created_timestamp", "service_account_client_link", "not_before") VALUES
('34f8a4a1-728b-48a8-a43e-1ae7c5f31f07',	'jeff.tian@outlook.com',	'jeff.tian@outlook.com',	'0',	'1',	NULL,	'Jeff',	'Tian',	'master',	'admin',	1584243808082,	NULL,	0),
('71792e89-1d72-4509-b19f-ab19b35adb61',	'jeff.tian@outlook.com',	'jeff.tian@outlook.com',	'1',	'1',	NULL,	'Jeff',	'Tian',	'UniHeart',	'jeff.tian@outlook.com',	1590325541253,	NULL,	0);

DROP TABLE IF EXISTS "user_attribute";
CREATE TABLE "public"."user_attribute" (
                                           "name" character varying(255) NOT NULL,
                                           "value" character varying(255),
                                           "user_id" character varying(36) NOT NULL,
                                           "id" character varying(36) DEFAULT 'sybase-needs-something-here' NOT NULL,
                                           CONSTRAINT "constraint_user_attribute_pk" PRIMARY KEY ("id"),
                                           CONSTRAINT "fk_5hrm2vlf9ql5fu043kqepovbr" FOREIGN KEY (user_id) REFERENCES user_entity(id) NOT DEFERRABLE
) WITH (oids = false);

CREATE INDEX "idx_user_attribute" ON "public"."user_attribute" USING btree ("user_id");


CREATE TRIGGER "bucardo_kick_sync0" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_attribute" FOR EACH STATEMENT EXECUTE FUNCTION bucardo.bucardo_kick_sync0();;

CREATE TRIGGER "bucardo_delta" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_attribute" FOR EACH ROW EXECUTE FUNCTION bucardo.delta_public_user_attribute();;

CREATE TRIGGER "bucardo_kick_sync0" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_entity" FOR EACH STATEMENT EXECUTE FUNCTION bucardo.bucardo_kick_sync0();;

CREATE TRIGGER "bucardo_delta" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_entity" FOR EACH ROW EXECUTE FUNCTION bucardo.delta_public_user_entity();;

-- 2020-06-21 08:32:53.040985+00
