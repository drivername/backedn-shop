-- DropForeignKey
ALTER TABLE `commentaboutproduct` DROP FOREIGN KEY `CommentAboutProduct_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `commentaboutproduct` DROP FOREIGN KEY `CommentAboutProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_owner_id_fkey`;

-- CreateTable
CREATE TABLE `Messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `topic` VARCHAR(191) NOT NULL,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentAboutProduct` ADD CONSTRAINT `CommentAboutProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentAboutProduct` ADD CONSTRAINT `CommentAboutProduct_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
