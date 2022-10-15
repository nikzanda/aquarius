/*
  Warnings:

  - You are about to alter the column `minLevel` on the `tests` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `maxLevel` on the `tests` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `tests` MODIFY `minLevel` DOUBLE NULL,
    MODIFY `maxLevel` DOUBLE NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `categories_name_description_idx` ON `categories`(`name`, `description`);

-- CreateIndex
CREATE FULLTEXT INDEX `products_name_idx` ON `products`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `strips_name_idx` ON `strips`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `tests_name_idx` ON `tests`(`name`);
