-- Assignment 2 SQL Statements --
-- Statement 1 --
INSERT INTO "account" (
	account_firstname, account_lastname,
	account_email, account_password
) VALUES (
	'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

-- Statement 2 --
UPDATE "account" SET account_type = 'Admin' WHERE account_id = 1;

-- Statement 3 --
DELETE FROM "account" WHERE account_id = 1;

-- Statement 4 --
UPDATE "inventory" SET inv_description = REPLACE(inv_description, 'small interior', 'huge interior')
	WHERE inv_id = 10;

-- Statement 5 --
SELECT 
	classification.classification_id,
	classification.classification_name,
	inventory.inv_make,
	inventory.inv_model,
	inventory.classification_id
FROM
	inventory
	INNER JOIN classification USING(classification_id)
WHERE
	classification_id = 2

-- Statement 6
UPDATE "inventory" SET 
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

