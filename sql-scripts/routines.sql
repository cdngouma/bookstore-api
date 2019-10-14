delimiter $$
-- prevent user to delete company user
create trigger `del_bookstore_user` before delete on `users`
for each row
begin
	if Old.user_id = '_wD7I2s9' then
		signal sqlstate '45000' set message_text = 'Access denied';
	end if;
end; $$

delimiter ;