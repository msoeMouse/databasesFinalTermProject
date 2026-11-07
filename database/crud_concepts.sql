-- CRUD ideas in SQL, please convert this to Java code
-- Create an account
INSERT INTO account (email, password) VALUES ('freemang@blackmesa.gov', 'HalfLife3When');
-- Create a menu item listing
INSERT INTO cafeteriamenulisting VALUES (4, '2026-11-2', 'Lunch');
-- ### Create a review for a hamburger ###
INSERT INTO review
SELECT a.accountId, cml.menuItemId, cml.menuDate, '3'
FROM account a
JOIN cafeteriamenulisting cml
JOIN menuitem m ON cml.menuItemId = m.menuItemId
WHERE a.email = 'freemang@blackmesa.gov' AND m.menuItemId = 4
AND cml.menuDate = '2026-11-2';

-- get reviews with readable columns
SELECT r.accountId, r.menuItem, m.itemName, r.menuDate, r.rating 
FROM review r
JOIN menuitem m ON r.menuItem = m.menuItemId;

-- get the average review from the day 2026-11-02
INSERT INTO review VALUES (1, 4,'2026-11-02', 1), (2, 4, '2026-11-02', 4);

SELECT AVG(r.rating) FROM review r
JOIN cafeteriamenulisting c ON c.menuItemId = r.menuItem
AND c.menuDate = r.menuDate AND c.mealPeriodName = 'Lunch'
WHERE r.menuDate = '2026-11-02';

-- ### Update the calories of every item containing Soy by 5 unless it contains Dairy ###
INSERT INTO menuitem VALUES (6, 'Soylent', 'Distilled from Soy Beans', 100),
(7, 'Milk', 'Dairy drink', 75), (8, 'Soybean Pizza', 'N/A', 230);
INSERT INTO menuitemallergen VALUES (6, 2), (7, 3), (8, 2), (8,3), (8,1);

SELECT m.itemName, a.allergenType
FROM menuItem m
JOIN menuItemAllergen mia ON mia.menuItemId = m.menuItemId
JOIN allergen a ON a.allergenId = mia.allergenId;

SELECT DISTINCT m.itemName
FROM menuItem m
JOIN menuItemAllergen mia ON mia.menuItemId = m.menuItemId
JOIN (
	SELECT allergenId FROM allergen WHERE allergenType = 'Soy'
) AS s ON mia.allergenId = s.allergenId;

SELECT DISTINCT m.itemName
FROM menuItem m
JOIN menuItemAllergen mia ON mia.menuItemId = m.menuItemId
WHERE mia.menuItemId NOT IN (
	SELECT m2.menuItemId
    FROM menuItemAllergen m2
    JOIN allergen a ON m2.allergenId = a.allergenID
    WHERE a.allergenType = 'Dairy'
);

-- get items with soy and not dairy
SELECT DISTINCT m.itemName
FROM menuItem m
JOIN menuItemAllergen mia ON mia.menuItemId = m.menuItemId
JOIN ( -- get soy
	SELECT allergenId FROM allergen WHERE allergenType = 'Soy'
) AS s ON mia.allergenId = s.allergenId
WHERE mia.menuItemId NOT IN ( -- get not dairy
	SELECT m2.menuItemId
    FROM menuItemAllergen m2
    JOIN allergen a ON m2.allergenId = a.allergenID
    WHERE a.allergenType = 'Dairy'
);


-- ### Delete every review from an account where the item is under 40 calories ###
SELECT * FROM review r
-- JOIN cafeteriaMenuListing cml ON r.menuItem = cml.menuItemId AND r.menuDate = cml.menuDate
JOIN menuItem m ON m.menuItemId = r.menuItem
WHERE m.calories < 40;