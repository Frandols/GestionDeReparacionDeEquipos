-- Create the "clients" table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);

-- Insert sample data into "clients"
INSERT INTO
    clients (first_name, last_name, dni, email, phone_number)
VALUES
    (
        'Juan',
        'Perez',
        '12345678',
        'juan.perez@example.com',
        '555-1234'
    ),
    (
        'Maria',
        'Gomez',
        '23456789',
        'maria.gomez@example.com',
        '555-5678'
    ),
    (
        'Carlos',
        'Lopez',
        '34567890',
        'carlos.lopez@example.com',
        '555-6789'
    ),
    (
        'Lucia',
        'Fernandez',
        '45678901',
        'lucia.fernandez@example.com',
        '555-7890'
    );