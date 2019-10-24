drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products (
    item_id integer not null auto_increment,
    product_name varchar(100) not null,
    department_name varchar(100) not null,
    price integer(10),
    stock_quantity integer(10),
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("Ibanez RG7321 Electric 7-string Guitar", "Musical Instruments", 300, 3),
    ("Epiphone Les Paul Custom Electric Guitar", "Musical Instruments", 700, 5),
    ("American Idiot - Green Day CD", "CDs & Vinyl", 10, 400),
    ("Slipknot - Iowa CD", "CDs & Vinyl", 10, 495),
    ("Tool - Undertow CD", "CDs & Vinyl", 10, 400),
    ("blink-182 - untitled Vinyl", "CDs & Vinyl", 30, 200),
    ("Propellerhead Reason 10 DAW", "Music Software", 400, 500),
    ("Avid Pro Tools DAW", "Music Software", 600, 400),
    ("Avid Sibelius Ultimate Transcription Software", "Music Software", 200,200);