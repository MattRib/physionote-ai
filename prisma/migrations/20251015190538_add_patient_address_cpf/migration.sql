/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "city" TEXT;
ALTER TABLE "Patient" ADD COLUMN "complement" TEXT;
ALTER TABLE "Patient" ADD COLUMN "cpf" TEXT;
ALTER TABLE "Patient" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "Patient" ADD COLUMN "number" TEXT;
ALTER TABLE "Patient" ADD COLUMN "state" TEXT;
ALTER TABLE "Patient" ADD COLUMN "street" TEXT;
ALTER TABLE "Patient" ADD COLUMN "zipCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");
