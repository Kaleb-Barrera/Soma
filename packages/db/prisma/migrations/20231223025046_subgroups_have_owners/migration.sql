-- CreateTable
CREATE TABLE "isOwnerOf" (
    "userId" TEXT NOT NULL,
    "subgroupId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "subgroupId")
);

-- CreateIndex
CREATE INDEX "isOwnerOf_userId_idx" ON "isOwnerOf"("userId");

-- CreateIndex
CREATE INDEX "isOwnerOf_subgroupId_idx" ON "isOwnerOf"("subgroupId");
