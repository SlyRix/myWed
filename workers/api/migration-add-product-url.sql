-- Migration: Add product_url column to gifts table
-- Date: 2025-11-04
-- Description: Adds optional product_url field to allow direct purchase links

ALTER TABLE gifts ADD COLUMN product_url TEXT;
