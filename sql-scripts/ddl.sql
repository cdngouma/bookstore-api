create table `Users`(
	id varchar(8) PRIMARY KEY,
    username varchar(100) UNIQUE NOT NULL,
    user_email varchar(255) UNIQUE NOT NULL,
    user_password varchar(255) NOT NULL,
    created_at timestamp DEFAULT NOW()
);

ALTER TABLE `Users` ADD CONSTRAINT `ck_email_format` CHECK(REGEXP_LIKE(user_email, '^[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)$'));

create table `Merchants`(
	id varchar(8) PRIMARY KEY,
    user_id varchar(8) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    date_of_birth date NOT NULL,
    gender varchar(10) NOT NULL,
    street varchar(255) NOT NULL,
    apt varchar(5) NOT NULL,
    city varchar(255) NOT NULL,
    state char(2),
    zip_code varchar(10),
    country varchar(255) NOT NULL,
    created_at timestamp DEFAULT NOW()
);

ALTER TABLE `Merchants` ADD FOREIGN KEY(user_id) REFERENCES `Users`(id) ON DELETE CASCADE ON UPDATE CASCADE;
-- Set minimum age to sell at 13 ?
-- ALTER TABLE `Merchants` ADD CONSTRAINT `ck_min_age` CHECK(CURDATE() - date_of_birth >= 13);
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_gender` CHECK(UPPER(gender) IN ('MALE','FEMALE','NON-BINARY'));
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_street_format` CHECK(REGEXP_LIKE(street, '^([0-9]+) ([a-zA-Z\-_0-9 ]+)$'));
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_apartment_num` CHECK(REGEXP_LIKE(apt, '^[0-9]{1,4}[A-Z]?$'));
-- only require state for Canada and USA
ALTER TABLE `Merchants` ADD CONSTRAINT `ck_state` CHECK(UPPER(country) IN ('United States', 'Canada') OR state IS NULL);

create table `Books`(
	id varchar(8) PRIMARY KEY,
    isbn10 bigint(10) UNIQUE NOT NULL,
    isbn13 bigint(13) UNIQUE,
    author varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    publisher varchar(255) NOT NULL,
    published_date int(4) NOT NULL,
    edition varchar(255) NOT NULL,
    page_count int(4) NOT NULL,
    category varchar(255) NOT NULL,
    booK_language char(2),
    book_desc varchar(500),
    google_average_rating double,
    google_ratings_count int,
    image_link varchar(255) UNIQUE NOT NULL,
    created_at timestamp DEFAULT NOW()
);

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