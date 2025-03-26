/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clubId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrls` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `privacyLevel` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - The `id` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventAttendee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `img` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMember" DROP CONSTRAINT "ClubMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMember" DROP CONSTRAINT "ClubMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clubId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_eventId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_collegeId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "clubId",
DROP COLUMN "createdAt",
DROP COLUMN "mediaUrls",
DROP COLUMN "privacyLevel",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "img" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Club";

-- DropTable
DROP TABLE "ClubMember";

-- DropTable
DROP TABLE "College";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "EventAttendee";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "PrivacyLevel";

-- DropEnum
DROP TYPE "UserRole";
