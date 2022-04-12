USE `twulzserver`;

ALTER USER 'Twulz'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Wat124!dar';
flush privileges;

DROP TABLE IF EXISTS authentication;

DROP SCHEMA IF EXISTS `twulzserver`;

CREATE SCHEMA IF NOT EXISTS `twulzserver`;

USE `twulzserver`;

CREATE TABLE `authentication` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` CHAR(60) NOT NULL,
    `app_access` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id`)
);

SELECT * from user;

UPDATE user SET `app_access` = true WHERE user_id = 1;

SELECT * FROM authentication WHERE auth_id = 2;

DELETE FROM authentication WHERE auth_id = 5;

INSERT INTO authentication (`username`, `password`, `app_access`) VALUES ('testinguser@email.com', '$2b$10$XHXEA7Wmlc4bnyDUyDMND.HIoMZZv6yOW5C6rhyCKZSeK/KBdMxIO', true);