delimiter $$
-- Users procedures
create procedure `createUser`(IN p_id varchar(8), IN p_username varchar(255), IN p_email varchar(255), IN p_password varchar(255))
begin
	insert into `Users`(id, username, user_email, user_password) values(p_id, p_username, p_email, p_password);
    select username, user_email AS 'email', created_at AS 'createdAt' FROM `Users` WHERE id = p_id;
end; $$

create procedure `updateUser`(IN p_username varchar(255), IN p_email varchar(255), IN p_password varchar(255))
begin
	update `Users` SET username=COALESCE(p_username, username), user_email=COALESCE(p_email, user_email), user_password=COALESCE(p_password, user_password), modified_at=NOW();
    select username, user_email AS 'email', modified_at AS 'modifiedAt' FROM `Users` WHERE username = p_username;
end; $$

-- Merchant procedures
create procedure `createMerchant`(
	IN p_id varchar(8), IN p_username varchar(255), IN p_first_name varchar(255), IN p_last_name varchar(255), IN p_date_of_birth date, IN p_gender varchar(10),
    IN p_street varchar(255), IN p_apt varchar(5), IN p_city varchar(255), IN p_state char(2), IN p_zip_code varchar(100), IN p_country varchar(255)
)
begin
	declare user_id varchar(8);
	set p_user_id := (select id from Users where username = p_username);
	insert into `Merchants`(id, user_id, first_name, last_name, date_of_birth, gender, street, apt, city, state, zip_code, country)
    values(p_id, p_user_id, p_first_name, p_last_name, p_date_of_birth, p_gender, p_street, p_apt, p_city, p_state, p_zip_code, p_country);
    
    call getMerchantProfileByUsername(p_username);
end; $$

create procedure `getMerchantProfileByUsername`(IN p_username varchar(8))
begin
	declare p_user_id varchar(100);
    set p_user_id := (select id FROM Users WHERE username = p_username);
    select username, first_name AS 'firstName', last_name AS 'lastName', date_of_birth AS 'dateOfBirth', gender, street, apt, city, state,
		zip_code AS 'zipCode', country, created_at AS 'createdAt' FROM `Merchants`
	JOIN `Users` ON `Merchants`.user_id = `Users`.id;
end; $$

create procedure `getMerchantLocationByUsername`(IN p_username varchar(8))
begin
	declare p_user_id varchar(100);
    set p_user_id := (select id FROM Users WHERE username = p_username);
    select username, street, apt, city, state, zip_code AS 'zipCode', co07untry FROM `Merchants`
	JOIN `Users` ON `Merchants`.user_id = `Users`.id;
end; $$

-- Book procedures
create procedure `createNewBook`(
	IN p_id varchar(8), IN p_isbn10 bigint, IN p_isbn13 bigint, IN p_title varchar(255), IN p_author varchar(255), IN p_publisher varchar(255), IN p_published_date int,
    IN p_edition varchar(255), IN p_page_count int, IN p_category varchar(100), IN p_book_language char(2), IN p_book_desc varchar(500), IN p_image_link varchar(255)
)
begin
	insert into `Books`(id, isbn10, isbn13, title, author, publisher, published_date, edition, page_count, category, book_language, book_desc, image_link)
	values(p_id, p_isbn10, p_isbn13, p_title, p_author, p_publisher, p_published_date, p_edition, p_page_count, p_category, p_book_language, p_book_desc, p_image_link);
    
    call findBookById(p_id);
end; $$

create procedure `findBookById`(IN book_id int)
begin
	select id, isbn10, isbn13, title, author, publisher, published_date AS 'publishedDate', edition, page_count AS 'pageCount', category, book_language AS 'language',
		book_desc AS 'description', image_link AS 'imageLink', created_at AS 'createdAt' FROM `Books` WHERE id = book_id;
end; $$

create procedure `findBookByIsbn` (IN isbn_code bigint)
begin
	select id, isbn10, isbn13, title, author, publisher, published_date AS 'publishedDate', edition, page_count AS 'pageCount', category, book_language AS 'language',
		book_desc AS 'description', image_link AS 'imageLink', created_at AS 'createdAt' FROM `Books` WHERE isbn10 = isbn_code OR isbn13 = isbn_code;
end; $$

create procedure `findBookByIsbnPreview` (IN isbn_code bigint)
begin
	select id, isbn10, isbn13, title, author, published_date AS 'publishedDate', category, image_link AS 'imageLink'
    FROM `Books` WHERE isbn10 = isbn_code OR isbn13 = isbn_code;
end; $$