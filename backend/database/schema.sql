-- Table for products
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    sellerName TEXT NOT NULL,
    sellerContact TEXT NOT NULL
);

-- Table for cattle
CREATE TABLE IF NOT EXISTS cattle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    breed TEXT NOT NULL,
    image TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    sellerName TEXT NOT NULL,
    sellerContact TEXT NOT NULL
);

-- Table for equipment
CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    image TEXT NOT NULL,
    rent REAL NOT NULL,
    location TEXT NOT NULL,
    sellerName TEXT NOT NULL,
    sellerContact TEXT NOT NULL
);

-- Table for labour
CREATE TABLE IF NOT EXISTS labour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    rent_per_day REAL NOT NULL
);
