CREATE DATABASE companystore;

create table cinstore(
    db_id SERIAL primary key,
    CIN varchar(255),
    name varchar(255)
);