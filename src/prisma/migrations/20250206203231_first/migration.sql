-- CreateEnum
CREATE TYPE "Currencies" AS ENUM ('brl', 'eur', 'usd');

-- CreateEnum
CREATE TYPE "Months" AS ENUM ('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'accountant', 'user', 'company_employee');

-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('withdraw', 'payment', 'saving', 'revenue');

-- CreateEnum
CREATE TYPE "TransactionAgents" AS ENUM ('company', 'external_platform', 'external', 'business_associate', 'employee');

-- CreateEnum
CREATE TYPE "TributationTypes" AS ENUM ('simples_nacional', 'lucro_presumido', 'lucro_real', 'lucro_arbitrado');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('business_associate', 'employee');

-- CreateEnum
CREATE TYPE "FeeTypes" AS ENUM ('convertion_from_amount_fee', 'convertion_to_amount_fee', 'platform_deposit_fee', 'platform_withdrawal_fee', 'other_fee');

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "legal_name" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "company_legal_number" TEXT NOT NULL,
    "address" TEXT,
    "address_number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "country" TEXT,
    "tributation_type" "TributationTypes" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platforms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversions" (
    "id" SERIAL NOT NULL,
    "from_amount" TEXT NOT NULL,
    "to_amount" TEXT NOT NULL,
    "from_currency" "Currencies" NOT NULL,
    "to_currency" "Currencies" NOT NULL,
    "market_currency_value" TEXT NOT NULL,
    "platform_currency_value" TEXT NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EmployeeType" NOT NULL DEFAULT 'business_associate',
    "company_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "amount_percentage" TEXT,
    "description" TEXT,
    "currency" "Currencies" NOT NULL,
    "fee_type" "FeeTypes" NOT NULL,
    "company_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remunerations" (
    "id" SERIAL NOT NULL,
    "amount_sugested" TEXT NOT NULL,
    "netAmount_sugested" TEXT NOT NULL,
    "amount_paid" TEXT NOT NULL,
    "netAmount_paid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "currency" "Currencies" NOT NULL,
    "company_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "transaction_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remunerations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenues" (
    "id" TEXT NOT NULL,
    "total_amount" TEXT NOT NULL,
    "total_fee_amount" TEXT NOT NULL,
    "total_taxes_amount" TEXT NOT NULL,
    "currency" "Currencies" NOT NULL,
    "description" TEXT,
    "received_date" TIMESTAMP(3) NOT NULL,
    "source_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "conversion_id" INTEGER,
    "transaction_id" INTEGER NOT NULL,
    "summary_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summaries" (
    "id" SERIAL NOT NULL,
    "total_remuneration" TEXT,
    "total_profit" TEXT,
    "total_revenues" TEXT,
    "total_fees" TEXT,
    "total_taxes" TEXT,
    "total_debts" TEXT,
    "total_debts_percentage" TEXT,
    "remunaration_withdraw" TEXT,
    "profit_withdraw_sugestion" TEXT,
    "profit_withdrawed" TEXT,
    "total_withdrawed" TEXT,
    "remaining_amount" TEXT,
    "remaining_amount_total" TEXT,
    "summary_date" TIMESTAMP(3) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currency" "Currencies" NOT NULL,
    "company_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "transaction_type" "TransactionTypes" NOT NULL,
    "description" TEXT NOT NULL,
    "from_agent" "TransactionAgents" NOT NULL,
    "to_agent" "TransactionAgents" NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "google_id" TEXT,
    "name" TEXT,
    "role" "Roles" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies_users" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "companies_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees_conversions" (
    "id" SERIAL NOT NULL,
    "fees_id" INTEGER NOT NULL,
    "conversions_id" INTEGER NOT NULL,

    CONSTRAINT "fees_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees_remunerations" (
    "id" SERIAL NOT NULL,
    "feeId" INTEGER NOT NULL,
    "remunerationsId" INTEGER NOT NULL,

    CONSTRAINT "fees_remunerations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees_summaries" (
    "id" SERIAL NOT NULL,
    "feeId" INTEGER NOT NULL,
    "summaryId" INTEGER NOT NULL,

    CONSTRAINT "fees_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remunerations_summaries" (
    "id" SERIAL NOT NULL,
    "remunerationsId" INTEGER NOT NULL,
    "summaryId" INTEGER NOT NULL,

    CONSTRAINT "remunerations_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes_remunerations" (
    "id" SERIAL NOT NULL,
    "taxId" INTEGER NOT NULL,
    "remunerationsId" INTEGER NOT NULL,

    CONSTRAINT "taxes_remunerations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes_summaries" (
    "id" SERIAL NOT NULL,
    "taxId" INTEGER NOT NULL,
    "summaryId" INTEGER NOT NULL,

    CONSTRAINT "taxes_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_users_userId_companyId_key" ON "companies_users"("userId", "companyId");

-- CreateIndex
CREATE INDEX "fees_conversions_fees_id_conversions_id_idx" ON "fees_conversions"("fees_id", "conversions_id");

-- CreateIndex
CREATE UNIQUE INDEX "fees_remunerations_feeId_remunerationsId_key" ON "fees_remunerations"("feeId", "remunerationsId");

-- CreateIndex
CREATE UNIQUE INDEX "fees_summaries_feeId_summaryId_key" ON "fees_summaries"("feeId", "summaryId");

-- CreateIndex
CREATE UNIQUE INDEX "remunerations_summaries_remunerationsId_summaryId_key" ON "remunerations_summaries"("remunerationsId", "summaryId");

-- CreateIndex
CREATE UNIQUE INDEX "taxes_remunerations_taxId_remunerationsId_key" ON "taxes_remunerations"("taxId", "remunerationsId");

-- CreateIndex
CREATE UNIQUE INDEX "taxes_summaries_taxId_summaryId_key" ON "taxes_summaries"("taxId", "summaryId");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversions" ADD CONSTRAINT "conversions_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees" ADD CONSTRAINT "fees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remunerations" ADD CONSTRAINT "remunerations_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remunerations" ADD CONSTRAINT "remunerations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remunerations" ADD CONSTRAINT "remunerations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_conversion_id_fkey" FOREIGN KEY ("conversion_id") REFERENCES "conversions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_summary_id_fkey" FOREIGN KEY ("summary_id") REFERENCES "summaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summaries" ADD CONSTRAINT "summaries_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes" ADD CONSTRAINT "taxes_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies_users" ADD CONSTRAINT "companies_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies_users" ADD CONSTRAINT "companies_users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_conversions" ADD CONSTRAINT "fees_conversions_fees_id_fkey" FOREIGN KEY ("fees_id") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_conversions" ADD CONSTRAINT "fees_conversions_conversions_id_fkey" FOREIGN KEY ("conversions_id") REFERENCES "conversions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_remunerations" ADD CONSTRAINT "fees_remunerations_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_remunerations" ADD CONSTRAINT "fees_remunerations_remunerationsId_fkey" FOREIGN KEY ("remunerationsId") REFERENCES "remunerations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_summaries" ADD CONSTRAINT "fees_summaries_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_summaries" ADD CONSTRAINT "fees_summaries_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remunerations_summaries" ADD CONSTRAINT "remunerations_summaries_remunerationsId_fkey" FOREIGN KEY ("remunerationsId") REFERENCES "remunerations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remunerations_summaries" ADD CONSTRAINT "remunerations_summaries_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes_remunerations" ADD CONSTRAINT "taxes_remunerations_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes_remunerations" ADD CONSTRAINT "taxes_remunerations_remunerationsId_fkey" FOREIGN KEY ("remunerationsId") REFERENCES "remunerations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes_summaries" ADD CONSTRAINT "taxes_summaries_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes_summaries" ADD CONSTRAINT "taxes_summaries_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
