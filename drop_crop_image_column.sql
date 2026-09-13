-- Migration script to delete the `image` column from `crop` table in database
USE arunella_db;

ALTER TABLE `crop` DROP COLUMN IF EXISTS `image`;
