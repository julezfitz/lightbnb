
-- INSERT INTO users (name, email, password)
-- VALUES ('Lukey', 'first@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- ('Skipper', 'second@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- ('Barrett', 'third@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- ('Jonah', 'fourth@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, country, street, city, province, post_code)
-- VALUES (1, 'Seascape', 'Beautiful seaside cottage', 'this.url', 'that.url', 150, 'Canada', 'Ocean Drive', 'Tilting', 'NL', 'e4y6y4'),
-- (2, 'Wood Cabin Dream', 'Secluded wood log cabin', 'this.url', 'that.url', 100, 'Canada', 'Tree Road', 'Forest', 'NB', 'r5e5h4'),
-- (3, 'Penthouse Royale', 'High class penthouse downtown', 'this.url', 'that.url', 800, 'Canada', 'Downtown Road', 'Toronto', 'ON', 'b4b2u1'),
-- (4, 'Treehouse', 'Rough treehouse with raccoons', 'this.url', 'that.url', 10, 'Canada', 'My Backyard', 'Middle Of Nowhere', 'NS', 'y6t7j5');

-- INSERT INTO reservations (id, guest_id, property_id, start_date, end_date)
-- VALUES (1, 1, 1, '2018-09-11', '2018-09-26'),
-- (2, 2, 2, '2019-01-04', '2019-02-01'),
-- (3, 3, 3, '2021-10-01', '2021-10-14'),
-- (4, 1, 3, '2021-09-05', '2021-09-11');

-- INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
-- VALUES (1, 1, 1, 4, 'Stunning sea views!'),
-- (2, 2, 2, 2, 'Finally, I escaped people'),
-- (3, 3, 3, 3, 'Best party location with access to downtown, but loads of stairs'),
-- (4, 4, 4, 5, 'The raccoons were so friendly, I brought one home with me!');

