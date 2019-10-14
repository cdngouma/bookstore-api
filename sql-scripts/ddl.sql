-- GLOBAL:
create table `countries`(
	country_id int unsigned auto_increment primary key,
    country_name varchar(75) unique not null,
    short_name char(2) not null,
    country_region varchar(15) not null
);

create table `states`(
	state_id int unsigned auto_increment primary key,
    country_id int unsigned not null,
    state_name varchar(50) not null,
    short_name char(2) not null
);

alter table `states` add constraint `unique_state` unique(country_id, short_name);
alter table `states` add foreign key (country_id) references `countries` (country_id);

-- USERS:
create table `users`(
	user_id varchar(8) primary key,
    username varchar(100) unique not null,
    user_email varchar(255) unique not null,
    user_password varchar(255) not null,
    created_at datetime default NOW()
);

alter table `users` add constraint `check_email_format` check(REGEXP_LIKE(user_email, '^[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)$'));

create table `users_info`(
	user_id varchar(8) unique not null,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    date_of_birth date not null,
    gender varchar(10),
    updated_at datetime
);

alter table `users_info` add foreign key (user_id) references `users` (user_id);
alter table `users_info` add constraint `check_user_gender` check (LOWER(gender) in ('male', 'female', 'non-binary'));

-- Merchants:
create table `sellers`(
	seller_id varchar(8) primary key,
    user_id varchar(8) not null,
    verified boolean not null default false,
    created_at datetime default NOW()
);

alter table `sellers` add foreign key (user_id) references `users` (user_id);

create table `sellers_addresses`(
	seller_id varchar(8) unique not null,
    line1 varchar(255) not null,
    city varchar(100) not null,
    state char(2),
    country varchar(75) not null,
    zip_code varchar(5),
    updated_at datetime
);

alter table `sellers_addresses` add foreign key (seller_id) references `sellers` (seller_id);
alter table `sellers_addresses` add constraint `check_address` check (REGEXP_LIKE(line1, '^([0-9]+) ([a-zA-Z ]+) ((Apt|Suite|Unit|apt|suite|unit) ([1-9][0-9]{0,4}[A-Z]?))?$'));
alter table `sellers_addresses` add constraint `check_zipcode` check (zip_code >= 10000);

-- BOOKS:
create table `books`(
	book_id varchar(8) primary key,
    isbn10 varchar(10) unique,
    isbn13 varchar(13) unique,
    title varchar(255) not null,
    author varchar(100) not null,
    category varchar(80) not null,
	edition varchar(100) not null,
    publisher varchar(100) not null,
    published_date int(4) unsigned not null,
    page_count int(4) unsigned not null,    
    `language` char(2),
    `description` varchar(500),
    image_link varchar(255) unique not null,
    created_at timestamp default NOW()
);

alter table `books` add constraint `check_isbn_format` check((isbn10 is not null or isbn13 is not null) and LENGTH(isbn10) = 10 and LENGTH(isbn13) = 13);
alter table `books` add constraint `unique_book` unique (author, title, edition, published_date);
alter table `books` add constraint `check_book_language` check (LENGTH(`language`) = 2);

create view `book_general_info` as
select id, isbn10, isbn13, author, title, published_date, image_link, created_at
from `books`;

create table `products`(
	product_id varchar(8) primary key,
    book_id varchar(8) not null,
    seller_id varchar(8) not null,
    price double(5,2) unsigned not null,
    quality varchar(4) not null,
    in_stock int unsigned not null,
    created_at timestamp default NOW()
);

alter table `products` add foreign key (book_id) references `books` (book_id);
alter table `products` add foreign key (seller_id) references `sellers` (seller_id);
alter table `products` add constraint `check_quality` check (LOWER(quality) in ('used','like-new'));
