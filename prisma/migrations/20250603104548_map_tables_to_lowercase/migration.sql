-- DropForeignKey
ALTER TABLE `_classtouser` DROP FOREIGN KEY `_ClassToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_classtouser` DROP FOREIGN KEY `_ClassToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation` DROP FOREIGN KEY `Evaluation_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation` DROP FOREIGN KEY `Evaluation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `score` DROP FOREIGN KEY `Score_evaluationId_fkey`;

-- DropForeignKey
ALTER TABLE `score` DROP FOREIGN KEY `Score_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_classId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_classId_fkey`;

-- DropIndex
DROP INDEX `Evaluation_taskId_fkey` ON `evaluation`;

-- DropIndex
DROP INDEX `Evaluation_userId_fkey` ON `evaluation`;

-- DropIndex
DROP INDEX `Score_evaluationId_fkey` ON `score`;

-- DropIndex
DROP INDEX `Score_studentId_fkey` ON `score`;

-- DropIndex
DROP INDEX `Student_classId_fkey` ON `student`;

-- DropIndex
DROP INDEX `Task_classId_fkey` ON `task`;

-- RenameIndex
ALTER TABLE `admin` RENAME INDEX `Admin_username_key` TO `admin_username_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;
