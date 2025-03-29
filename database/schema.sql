-- Table for farmers
CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    registration_date TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table for products
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    farmer_id INTEGER NOT NULL,
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
);

-- Table for labour
CREATE TABLE IF NOT EXISTS labour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    rent_per_day REAL NOT NULL
);

-- Table for orders
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    delivery_option TEXT NOT NULL,
    order_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
);
