create table `Users`(
	id bigint(17) UNSIGNED PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    date_of_birth date NOT NULL,
    gender varchar(7),
    street_address varchar(255) NOT NULL,
    apt varchar(4) NOT NULL,
    city varchar(255) NOT NULL,
    state char(2),
    zip varchar(10),
    country varchar(255) NOT NULL,
    profile_img varchar(255) UNIQUE,
    is_seller boolean DEFAULT FALSE,
    created_at timestamp DEFAULT NOW()
);

ALTER TABLE `Users` ADD CONSTRAINT `ck_email` CHECK(REGEXP_LIKE(email, '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'));
ALTER TABLE `Users` ADD CONSTRAINT `ck_gender` CHECK(UPPER(gender) IN('MALE','FEMALE','OTHER'));
-- Street address fromat: [street number] [street name] 
ALTER TABLE `Users` ADD CONSTRAINT `ck_street_address` CHECK(REGEXP_LIKE(street_address, '^[0-9]+ ([a-zA-Z ]+)$'));
-- apt number take digits and one capital letter (optional)
ALTER TABLE `Users` ADD CONSTRAINT `ck_apt_number` CHECK(REGEXP_LIKE(apt, '^[0-9]{1,3}(|[A-Z])$'));
-- Only use State if country is the USA or Canada | require 2 letter for the State
ALTER TABLE `Users` ADD CONSTRAINT `ck_state` CHECK(state IS NULL OR (UPPER(country) IN('UNITED STATES', 'CANADA', 'USA') AND LENGTH(state)=2));

create view `UserInfo` AS
select id, username, first_name, last_name, date_of_birth, gender, street_address, apt, city, state, zip, country, profile_img, is_seller
from `Users`;

create view `UserCredentials` AS
select id, username, email, `password`
from `Users`;

create table `Books`(
	id bigint(17) UNSIGNED PRIMARY KEY,
    isbn10 bigint(10) UNIQUE,
    isbn13 bigint(13) UNIQUE,
    author varchar(255) NOT NULL,
	title varchar(100) NOT NULL,
    publisher varchar(100) NOT NULL,
    published_date date NOT NULL,
    edition varchar(100),
    pages int(4) UNSIGNED NOT NULL CHECK(pages > 0),
    category varchar(100) NOT NULL,
    lang char(2) NOT NULL,
    `desc` varchar(500),
    cover varchar(255) UNIQUE NOT NULL,
    created_at datetime DEFAULT NOW()
);

ALTER TABLE `Books` ADD CONSTRAINT `unq_book` UNIQUE(author, title, publisher, published_date);
-- only ISBN-10 and ISBN-13 supported
ALTER TABLE `Books` ADD CONSTRAINT `ck_isbn` CHECK((isbn10 IS NOT NULL OR isbn13 IS NOT NULL) AND LENGTH(isbn10)=10 AND LENGTH(isbn13)=13);

create view `BookGeneral` AS
select id, isbn10, isbn13, author, title, category, cover
from `Books`;

create table `Products`(
	id bigint(17) UNSIGNED PRIMARY KEY,
    bookId bigint(17) UNSIGNED NOT NULL,
    sellerId bigint(17) UNSIGNED NOT NULL,
	price double(5,2) UNSIGNED NOT NULL,
    quality varchar(8) NOT NULL,
	`format` varchar(10) NOT NULL DEFAULT 'Paperback',
	width float(3,1) UNSIGNED,
	height float(3,1) UNSIGNED,
	thickness float(3,1) UNSIGNED,
	weight float(3,1) UNSIGNED,    
	created_at datetime DEFAULT NOW()
);

ALTER TABLE `Products` ADD FOREIGN KEY(bookId) REFERENCES `Books`(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Products` ADD FOREIGN KEY(sellerId) REFERENCES `Users`(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Products` ADD CONSTRAINT `ck_quality` CHECK(UPPER(quality) IN('USED','LIKE-NEW','NEW'));
ALTER TABLE `Products` ADD CONSTRAINT `ck_format` CHECK(UPPER(`format`) IN('HARDCOVER','PAPERBACK','LOOSE-LEAF'));

create table `BookReviews`(
	id int(5) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bookId varchar(17) NOT NULL,
    userId varchar(17) NOT NULL,
    rate tinyint(1) UNSIGNED NOT NULL CHECK(rate > 0 AND rate <= 5),
    created_at timestamp DEFAULT NOW()
);

ALTER TABLE `BookReviews` ADD FOREIGN KEY(bookId) REFERENCES `Books`(id) ON DELETE CASCADE;
ALTER TABLE `BookReviews` ADD FOREIGN KEY(userId) REFERENCES `Users`(id);
ALTER TABLE `BookReviews` ADD CONSTRAINT `unq_book_review` UNIQUE(userId, bookId);

create table `SellerReviews`(
	id int(5) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sellerId varchar(17) NOT NULL,
    userId varchar(17) NOT NULL,
    rate tinyint(1) UNSIGNED NOT NULL CHECK(rate > 0 AND rate <= 5),
    memo varchar(500),
    created_at timestamp DEFAULT NOW()
);

ALTER TABLE `SellerReviews` ADD FOREIGN KEY(sellerId) REFERENCES `Users`(id) ON DELETE CASCADE;
ALTER TABLE `SellerReviews` ADD FOREIGN KEY(userId) REFERENCES `Users`(id);
ALTER TABLE `SellerReviews` ADD CONSTRAINT `unq_seller_review` UNIQUE(userId, sellerId);
ALTER TABLE `SellerReviews` ADD CONSTRAINT `ck_review_self` CHECK(userId <> sellerId);

create table `Orders`(
	_id int(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productId int(5) UNSIGNED NOT NULL,
    userId int(5) UNSIGNED NOT NULL,
    amount double(7,2) UNSIGNED NOT NULL,
    order_date date NOT NULL,
    return_date date NOT NULL,
    is_returned boolean NOT NULL DEFAULT false
);

ALTER TABLE `Orders` ADD FOREIGN KEY(productId) REFERENCES `Products`(id);
ALTER TABLE `Orders` ADD FOREIGN KEY(userId) REFERENCES `Users`(id);

DELIMITER $$

CREATE TRIGGER `ins_user` BEFORE INSERT ON `Users` 
FOR EACH ROW
BEGIN
	IF NEW.id IS NULL THEN SET NEW.id = UUID_SHORT();
    END IF;
    
    IF CURDATE() - NEW.date_of_birth < 13 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Minimum age required is 13: for column \'date_of_birth\'';
    END IF;
END; $$

CREATE TRIGGER `upd_user` BEFORE UPDATE ON `Users` 
FOR EACH ROW
BEGIN
	IF NEW.id IS NULL THEN SET NEW.id = UUID_SHORT();
    END IF;
    
    IF CURDATE() - NEW.date_of_birth < 13 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Minimum age required is 13: for column \'date_of_birth\'';
    END IF;
END; $$

CREATE TRIGGER `ins_book` BEFORE INSERT ON `Books`
FOR EACH ROW
BEGIN
	IF NEW.id IS NULL THEN
		SET NEW.id = UUID_SHORT();
	END IF;
    
    IF NEW.published_date > CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ambigious value: for column \'published_date\'';
	END IF;
END; $$

CREATE TRIGGER `upd_book` BEFORE UPDATE ON `Books`
FOR EACH ROW
BEGIN
	IF NEW.id IS NULL THEN
		SET NEW.id = UUID_SHORT();
	END IF;
    
    IF NEW.published_date > CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ambigious value: for column \'published_date\'';
	END IF;
END; $$

CREATE TRIGGER `ins_product` BEFORE INSERT ON `Products`
FOR EACH ROW
BEGIN
	IF NEW.id IS NULL THEN
		SET NEW.id = UUID_SHORT();
	END IF;
END; $$

CREATE TRIGGER `upd_product` BEFORE UPDATE ON `Products`
FOR EACH ROW
BEGIN
	IF NEW.id IS NULL THEN
		SET NEW.id = UUID_SHORT();
	END IF;
END; $$

DELIMITER ;