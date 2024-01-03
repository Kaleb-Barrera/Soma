/*
  Warnings:

  - You are about to drop the column `typeId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `eventType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Event_typeId_idx` ON `Event`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `typeId`,
    ADD COLUMN `action` INTEGER NOT NULL;

-- DropTable
DROP TABLE `eventType`;

-- CreateTable
CREATE TABLE `ActionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Event_action_idx` ON `Event`(`action`);
