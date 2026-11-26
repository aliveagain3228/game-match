/*
  Warnings:

  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Friendship_senderId_key";

-- DropIndex
DROP INDEX "Friendship_senderId_receiverId_idx";

-- CreateIndex
CREATE INDEX "Friendship_senderId_idx" ON "Friendship"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_senderId_receiverId_key" ON "Friendship"("senderId", "receiverId");
