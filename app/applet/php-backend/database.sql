CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_name` varchar(50) NOT NULL,
  `key_value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `settings` (`key_name`, `key_value`) VALUES
('fbPixelId', 'YOUR_PIXEL_ID'),
('fbAccessToken', 'YOUR_ACCESS_TOKEN'),
('fbTestEventCode', ''),
('ga4Id', 'YOUR_GA4_ID');
