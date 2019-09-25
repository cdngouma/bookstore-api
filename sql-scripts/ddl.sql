create table `Users`(
	id varchar(8) PRIMARY KEY,
    username varchar(100) UNIQUE NOT NULL,
    user_email varchar(255) UNIQUE NOT NULL,
    user_password varchar(255) NOT NULL,
    created_at timestamp DEFAULT NOW(),
    last_accessed timestamp DEFAULT NOW(),
    last_modified timestamp
);

ALTER TABLE `Users` ADD CONSTRAINT `ck_email_format` CHECK(REGEXP_LIKE(user_email, '^[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)$'));

create table `Merchants`(
	id varchar(8) PRIMARY KEY,
    user_id varchar(8) NOT NULL,
    business varchar(255),
    first_name varchar(255),
    last_name varchar(255),
    date_of_birth date,
    gender varchar(10),
    street varchar(255) NOT NULL,
    apt varchar(5),
    city varchar(255) NOT NULL,
    state char(2),
    zip_code varchar(10),
    country varchar(255) NOT NULL,
    created_at timestamp DEFAULT NOW(),
    last_modified timestamp
);

ALTER TABLE `Merchants` ADD FOREIGN KEY(user_id) REFERENCES `Users`(id) ON DELETE CASCADE ON UPDATE CASCADE;
-- Set minimum age to sell at 13 ?
-- ALTER TABLE `Merchants` ADD CONSTRAINT `ck_min_age` CHECK(CURDATE() - date_of_birth >= 13);
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_gender` CHECK(UPPER(gender) IN ('MALE','FEMALE','NON-BINARY'));
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_street_format` CHECK(REGEXP_LIKE(street, '^([0-9]+) ([a-zA-Z\-_0-9 ]+)$'));
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_apartment_num` CHECK(REGEXP_LIKE(apt, '^[0-9]{1,4}[A-Z]?$'));
-- only require state for Canada and USA
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_state` CHECK(UPPER(country) IN ('United States', 'Canada') OR state IS NULL);
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_if_business_or_individual` CHECK((first_name IS NOT NULL AND last_name IS NOT NULL AND date_of_birth IS NOT NULL AND gender IS NOT NULL AND apt IS NOT NULL) XOR business IS NULL);

create table `Books`(
	id varchar(8) PRIMARY KEY,
    isbn10 varchar(10) UNIQUE,
    isbn13 varchar(13) UNIQUE,
    author varchar(100) NOT NULL,
    title varchar(255) NOT NULL,
    publisher varchar(100) NOT NULL,
    published_date int(4) UNSIGNED NOT NULL,
    edition varchar(100) NOT NULL,
    page_count int(4) UNSIGNED NOT NULL,
    category varchar(80) NOT NULL,
    book_language char(2),
    book_desc varchar(500),
    init_average_rating float(2,1) UNSIGNED,
    init_ratings_count int(5) UNSIGNED,
    image_link varchar(255) UNIQUE NOT NULL,
    created_at timestamp DEFAULT NOW()
);

ALTER TABLE `Books` ADD CONSTRAINT `ck_isbn10` CHECK(LENGTH(isbn10) = 10);
ALTER TABLE `Books` ADD CONSTRAINT `ck_isbn13` CHECK(LENGTH(isbn10) = 13);
ALTER TABLE `Books` ADD CONSTRAINT `ck_isbns` CHECK(isbn10 IS NOT NULL OR isbn13 IS NOT NULL);
ALTER TABLE `Books` ADD CONSTRAINT `unq_book` UNIQUE(author, title, edition);
-- ALTER TABLE `Books` ADD CONSTRAINT `ck_publication_year` CHECK(published_date <= YEAR(NOW()));
ALTER TABLE `Books` ADD CONSTRAINT `ck_book_lang` CHECK(LENGTH(book_language) = 2);

create view `BooksGeneral` AS
SELECT id, isbn10, isbn13, author, title, published_date, image_link, created_at
FROM `Books`;

create table `Products`(
	id varchar(8) PRIMARY KEY,
    book_id varchar(8) NOT NULL,
    merchant_id varchar(8) NOT NULL,
    price double(5,2) NOT NULL,
    quality varchar(4) NOT NULL,
    print_type varchar(10) NOT NULL,
    width float(3,1) NOT NULL,
    `length` float(3,1) NOT NULL,
    thickness float(3,1)NOT NULL,
    weight float(3,1),
    created_at timestamp DEFAULT NOW()
);

create table `Orders`(
	id bigint(8) PRIMARY KEY,
    user_id varchar(8) NOT NULL,
    product_id varchar(8) NOT NULL,
    amount double(6,2) NOT NULL,
    ordered_at timestamp DEFAULT NOW(),
    return_date date NOT NULL,
    is_returned boolean DEFAULT FALSE
);