-- CRUD ideas in SQL, please convert this to Java code
-- Create an account
INSERT INTO account (email, password) VALUES ('freemang@blackmesa.gov', 'HalfLife3When');
-- Create a menu item listing
INSERT INTO cafeteriamenulisting VALUES (4, '2026-11-2', 'Lunch');
-- Create a review for a hamburger
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

SELECT AVG(r.rating) FROM review r
JOIN cafeteriamenulisting c ON c.menuItemId = r.menuItem
AND c.menuDate = r.menuDate AND c.mealPeriodName = 'Lunch'
WHERE r.menuDate = '2026-11-02';

-- Update the calories of every item containing Soy by 5 unless it contains Dairy

-- Delete every review from an account where the item is under 40 calories