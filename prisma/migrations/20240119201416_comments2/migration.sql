/*
  Warnings:

  - Added the required column `dislike` to the `CommentAboutProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `like` to the `CommentAboutProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `commentaboutproduct` ADD COLUMN `dislike` INTEGER NOT NULL,
    ADD COLUMN `like` INTEGER NOT NULL;
