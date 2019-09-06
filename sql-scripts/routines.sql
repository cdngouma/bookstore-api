DELIMITER $$
CREATE PROCEDURE `create_book`(
	_isbn10 bigint, _isbn13 bigint, _title varchar(255), _author varchar(255), _publisher varchar(255), _published_date date, 
    _edition varchar(255), _pages int, _category varchar(100), _lang char(2), _desc varchar(500), _cover varchar(255)
)
BEGIN
DECLARE _id bigint;
SET _id := UUID_SHORT();
	-- create book
    INSERT INTO `Books`(id,isbn10,isbn13,title,author,publisher,published_date,edition,pages,category,lang,`desc`,cover)
		VALUES(_id, _isbn10, _isbn13, _title, _author, _publisher, _published_date, _edition, _pages, _category, _lang, _desc, _cover);
	-- return new book ID
    SELECT id FROM `Books` WHERE id=_id;
END; $$

DELIMITER $$
CREATE PROCEDURE `create_product`(_bookId bigint, _username varchar(100), _price double, _quality varchar(10), _width float, _height float, _thickness float, _weight float)
BEGIN
DECLARE _id bigint;
DECLARE _sellerId bigint;
SET _id := UUID_SHORT();
SET _sellerId := (SELECT id FROM `Users` WHERE username = @username);
	-- create product
    INSERT INTO `Products`(id, bookId, sellerId, price, quality, width, height, thickness, weight, created_at)
		VALUES(_id, _bookId, _sellerId, _price, _quality, _width, _height, _thickness, _weight, NOW());
	
    SELECT P.id, U.username, B.title, B.author, P.price, P.quality, P.width, P.height, P.thickness, P.weight 
		FROM `Products`
		JOIN `Books` B ON P.bookId=B.id
		JOIN `Users` U ON P.sellerId=U.id;
        
	-- make user a seller
    UPDATE `Users` SET is_seller = TRUE WHERE username = _username;
END; $$
DELIMITER ;