-- run finalProjectSetup first
INSERT INTO account (email, password) VALUES ('jak@msoe.edu', 'SeventyB'), ('chip@msoe.edu', 'SqueakSqueak');
INSERT INTO menuitem VALUES (1, 'Water', 'Fountain Drink', 0), (2, 'Lemonade', 'Fountain Drink', 20),
(3, 'Soda', 'Fountain Drink', 60), (4, 'Hamburger', 'Angus Beef Patty between wheat buns', 250),
(5, 'Pepperoni Pizza', 'Slice of classic Italian cuisine', 120);

INSERT INTO allergen (allergenType) VALUES ('Gluten'), ('Soy'), ('Dairy');
INSERT INTO mealperiod VALUES ('Breakfast'), ('Lunch'), ('Dinner');