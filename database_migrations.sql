-- Migration script to remove obsolete columns from arunella_db database
USE arunella_db;

-- 1. Remove `image` column from `crop` table
ALTER TABLE `crop` DROP COLUMN IF EXISTS `image`;

-- 2. Remove `wallet` column from `farmer` table
ALTER TABLE `farmer` DROP COLUMN IF EXISTS `wallet`;
