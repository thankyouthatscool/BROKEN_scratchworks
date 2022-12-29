/*
  Warnings:

  - You are about to drop the column `application` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "application",
ADD COLUMN     "applications" "Application"[];
