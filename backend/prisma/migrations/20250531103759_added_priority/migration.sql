/*
  Warnings:

  - You are about to drop the column `position` on the `Tasks` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "position",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'LOW';
