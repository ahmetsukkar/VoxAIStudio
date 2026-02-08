/*
  Warnings:

  - You are about to drop the column `creadits` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "creadits",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 30;
