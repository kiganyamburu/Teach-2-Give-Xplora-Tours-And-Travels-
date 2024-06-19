-- create an event
CREATE TABLE event (
    event_id VARCHAR(255) PRIMARY KEY,
    destination VARCHAR(50) NOT NULL,
    duration VARCHAR(50)NOT NULL,
    price DECIMAL(10,2) NOT NULL)
    
