/*
  Warnings:

  - Added the required column `isArticle` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "isArticle" BOOLEAN NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
