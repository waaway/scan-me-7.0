-- CreateTable
CREATE TABLE `MediaQueue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('image', 'video') NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `igName` VARCHAR(191) NULL,
    `duration` INTEGER NOT NULL,
    `status` ENUM('pending', 'shown') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(10, 2) NOT NULL,
    `message` VARCHAR(191) NULL,
    `igName` VARCHAR(191) NULL,
    `status` ENUM('pending', 'shown') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
