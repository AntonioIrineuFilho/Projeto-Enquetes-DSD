-- BANCO enquetes_db

PRAGMA foreign_keys = ON;

CREATE TABLE enquetes (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	start_date TEXT DEFAULT (date('now')),
	end_date TEXT 
);

CREATE TABLE choices (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	title TEXT NOT NULL,
	votes INTEGER DEFAULT 0,
	enquete_id INTEGER, 
	FOREIGN KEY(enquete_id) REFERENCES enquetes(id) ON DELETE CASCADE
);