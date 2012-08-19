
alter table orders drop foreign key FK_orders_user_id;
alter table member drop foreign key FK_member_user_id;
alter table member drop foreign key FK_member_restaurant_id;
alter table dish drop foreign key FK_dish_restaurant_id;
alter table order_dish drop foreign key FK_order_dish_order_id;
alter table order_dish drop foreign key FK_order_dish_dish_id;

drop table user;
drop table restaurant;
drop table dish;
drop table orders;
drop table member;
drop table order_dish;

create table user(
    id int(20) not null primary key auto_increment,
    username varchar(20) not null unique,
    password varchar(20) not null,
    name varchar(20) not null,
    tel varchar(20) not null,
    email varchar(50),
    image varchar(200)
)auto_increment=100;

create table restaurant(
    id int(20) not null primary key auto_increment,
    name varchar(50) not null unique,
    tel varchar(20) not null,
    address varchar(200) not null,
    intro varchar(500) not null,
    image varchar(200)
)auto_increment=10;

create table dish(
    id int(20) not null primary key auto_increment,
    name varchar(50) not null,
    price double not null,
    intro varchar(500) not null,
    restaurant_id int(20),
    image varchar(200)
)auto_increment=1000;

create table orders(
    id int(20) not null primary key auto_increment,
    user_id int(20),
    submit_time varchar(20) not null,
    status int(1) not null,
    rec_name varchar(20) not null,
    rec_tel varchar(20) not null,
    rec_addr varchar(200) not null
)auto_increment=1000;

create table order_dish(
    order_id int(20),
    dish_id int(20),
    quantity int(5)
);

create table member(
    id int(20) not null primary key auto_increment,
    role int(1) not null,
    restaurant_id int(20),
    user_id int(20),
    credits int(10)
)auto_increment=1;

alter table orders add constraint FK_orders_user_id foreign key(user_id) references user(id) on delete set null;
alter table member add constraint FK_member_user_id foreign key(user_id) references user(id) on delete set null;
alter table member add constraint FK_member_restaurant_id foreign key(restaurant_id) references restaurant(id) on delete set null;
alter table dish add constraint FK_dish_restaurant_id foreign key(restaurant_id) references restaurant(id) on delete set null;
alter table order_dish add constraint FK_order_dish_order_id foreign key(order_id) references orders(id) on delete set null;
alter table order_dish add constraint FK_order_dish_dish_id foreign key(dish_id) references dish(id) on delete set null;


insert into user(username, password,name, tel, email) values("scott", "123456","scott", "13511111111", "scott@163.com");
insert into user(username, password,name, tel, email) values("admin", "123456","admin", "13511111111", "admin@163.com");
insert into user(username, password,name, tel, email) values("resadm", "123456", "resadm", "13511111111", "resadm@163.com");
insert into member(role, user_id, credits) values(1, 100, 98);
insert into member(role, user_id) values(0, 101);
insert into member(role, user_id) values(2, 102);
insert into member(role, user_id, credits) values(1, 102, 19);

insert into restaurant(name, tel, address, intro) values("东北人家", "025-52124678", "江宁区胜太西路59-26号(近胜源中路)", "东北菜。这家的服务还是很到位的，而且菜的价格不贵，很实在，菜的味道也是很不错的哦。");
insert into restaurant(name, tel, address, intro) values("厨娘.CN", "025-87131777", "江宁区双龙大道1136号(近胜太路地铁站)", "菜单比较丰富 我点了面包诱惑 水煮鱼 给力手 酸汤肥牛 浮云鸡 香辣大虾 水煮牛肉 ");
insert into dish(name, price, intro, restaurant_id) values("地三鲜", 20, "你懂的", 10);
insert into dish(name, price, intro, restaurant_id) values("酱骨架", 30, "你懂的", 10);
insert into dish(name, price, intro, restaurant_id) values("小鸡炖蘑菇", 60, "你懂的", 10);
insert into dish(name, price, intro, restaurant_id) values("水煮鱼", 40, "你懂的", 11);
insert into dish(name, price, intro, restaurant_id) values("给力手", 35, "你懂的", 11);
insert into dish(name, price, intro, restaurant_id) values(" 香辣大虾", 50, "你懂的", 11);

insert into orders(user_id, submit_time, status, rec_name, rec_tel, rec_addr) values("100", "09:06", 1, "张三", "13458602123", "胜太路");

show variables like "%char%";
show create database meal_ordering;
set character set utf8;
select * from user;
select * from user,member where user.id=member.user_id;
select * from restaurant, dish where restaurant.id=dish.restaurant_id;