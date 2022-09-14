-- CreateTable
CREATE TABLE `strips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `minLevel` INTEGER NULL,
    `maxLevel` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests_on_strips` (
    `stripId` INTEGER NOT NULL,
    `testId` INTEGER NOT NULL,

    PRIMARY KEY (`stripId`, `testId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tests_on_strips` ADD CONSTRAINT `tests_on_strips_stripId_fkey` FOREIGN KEY (`stripId`) REFERENCES `strips`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests_on_strips` ADD CONSTRAINT `tests_on_strips_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `tests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
