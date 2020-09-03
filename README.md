### Тестовое задание:
Nest.js + REST + Swagger, и всё вокруг некоторой SQL базы про договора(ы)

#### Схема базы:

src/contracts/db/__diagram-01.png

#### Что-то типа первоначального наполнения "справочников":

``` 
insert into ContractType (name) values ('Первый тип')
insert into ContractType (name) values ('Второй тип')

insert into CompletionDocumentType (name) values ('Тип А')
insert into CompletionDocumentType (name) values ('Тип Б')
insert into CompletionDocumentType (name) values ('Тип Цэ')

insert into CurrencyInfo (code, digitCode, name) values ('RUB', 643, 'Российский рубль')
```

#### Environment vars:
+ HTTP_PORT
+ SQL_HOST
+ SQL_PORT
+ SQL_USERNAME
+ SQL_PASSWORD
+ SQL_DB

swagger ui на http://localhost:3000/api

Сейчас захардкодено 'mssql' в ините typeorm. Скорее всего, взлетит и на другой субд (если совсем без базы, то не увидим swagger ui).

#### Про авторизацию

Добавлен совсем простенький механизм авторизации

```
insert into UserInfo (username, password) values ('superadmin', '1234')
```

В swagger-ui нужно выполнить /auth/login и потом скопипастить access_token из респонса в окошко авторизации 