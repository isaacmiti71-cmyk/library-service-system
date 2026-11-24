-- Seed demonstration records for Library Service Requests
-- Inserted only if the table is currently empty

INSERT INTO records (title, category, description, status) VALUES
('Find a database textbook', 'Book search', 'I need help locating Fundamentals of Database Systems 7th Edition by Elmasri and Navathe.', 'Pending'),
('Renew overdue chemistry monograph', 'Borrowing', 'Requesting a 14-day loan extension for Advanced Inorganic Chemistry monograph.', 'In progress'),
('Reset student library portal PIN', 'Account help', 'My student card barcode is locked after three incorrect PIN attempts at the self-checkout kiosk.', 'Completed'),
('Locate IEEE conference proceedings', 'Research assistance', 'Need research access to the 2024 IEEE Transactions on Software Engineering archive.', 'Pending'),
('Place course reserve on Economics text', 'Reserve desk', 'Requesting 2-hour short-loan reserve access for Principles of Microeconomics course text.', 'In progress'),
('Inter-library loan for rare history thesis', 'Borrowing', 'Requesting digital loan transfer of 1982 Zambian Economic History dissertation from national repository.', 'Pending'),
('Clear graduation library fee clearance', 'Account help', 'Need library debt verification and stamp for end of semester graduation clearance audit.', 'Completed'),
('Access peer-reviewed health journals', 'Research assistance', 'Guidance required to access PubMed Central full-text articles through library off-campus proxy.', 'Pending');
