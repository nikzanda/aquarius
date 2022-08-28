/*
  Warnings:

  - You are about to drop the column `isActive` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `filters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `filters` DROP COLUMN `isActive`,
    DROP COLUMN `updatedAt`;
