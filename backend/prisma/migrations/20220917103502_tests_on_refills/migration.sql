-- CreateTable
CREATE TABLE `tests_on_refills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refillId` INTEGER NOT NULL,
    `testId` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tests_on_refills` ADD CONSTRAINT `tests_on_refills_refillId_fkey` FOREIGN KEY (`refillId`) REFERENCES `refills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests_on_refills` ADD CONSTRAINT `tests_on_refills_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `tests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
