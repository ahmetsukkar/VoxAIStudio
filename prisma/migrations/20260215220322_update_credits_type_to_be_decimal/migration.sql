/*
  Warnings:

  - You are about to alter the column `credits` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "credits" SET DEFAULT 30,
ALTER COLUMN "credits" SET DATA TYPE DECIMAL(10,2);
