-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ONBOARDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Platforms" AS ENUM ('MT4', 'MT5', 'MT4SA', 'MT5SA', 'MTT', 'cTrader', 'ARK');

-- CreateEnum
CREATE TYPE "Servers" AS ENUM ('live1', 'live2', 'live5', 'live7');

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "clientId" TEXT;

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "platform" "Platforms"[],
    "server" "Servers"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
