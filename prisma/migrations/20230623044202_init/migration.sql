-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Income',
    "amount" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Expense',
    "amount" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);
