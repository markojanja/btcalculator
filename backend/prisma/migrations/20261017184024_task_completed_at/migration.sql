-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TaskComments_taskId_idx" ON "TaskComments"("taskId");

-- CreateIndex
CREATE INDEX "Tasks_userId_status_idx" ON "Tasks"("userId", "status");

-- CreateIndex
CREATE INDEX "Tasks_status_idx" ON "Tasks"("status");

-- Backfill: existing completed tasks were last touched when they were completed.
UPDATE "Tasks" SET "completedAt" = "updatedAt" WHERE "status" = 'COMPLETED' AND "completedAt" IS NULL;
