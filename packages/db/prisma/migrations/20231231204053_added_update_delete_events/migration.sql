-- CreateTable
CREATE TABLE "eventType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Event_typeId_idx" ON "Event"("typeId");
