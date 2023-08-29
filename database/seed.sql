USE NtunhsAtm;

-- 建立 admin 使用者

INSERT INTO [SystemUser] (UserName, Name, Password)
VALUES ('admin', N'管理員', HASHBYTES('SHA2_512', 'admin'));
GO

-- 建立範例客戶

INSERT INTO [Customer] (UserName, FirstName, LastName, BirthDate, Country, City, Address, Password, UpdatedBy)
VALUES ('cylien', 'CY', 'Lien', '19981002', N'台灣', N'台北', N'內湖', HASHBYTES('SHA2_512', '123'), 1),
       ('ljkuo', 'LJ', 'KUO', '19981002', N'台灣', N'台北', N'天母', HASHBYTES('SHA2_512', '123'), 1),
       ('dwwang', 'DW', 'Wang', '19981002', N'台灣', N'台北', N'北投', HASHBYTES('SHA2_512', '123'), 1);
GO

-- 建立範例帳戶

INSERT INTO [Account] (AccountID, CustomerID, BranchID, Type, Balance, UpdatedBy)
VALUES ('1234567890', 1, 1, N'活期存款', 1000, 1),
       ('1234567891', 2, 2, N'定期存款', 2000, 1),
       ('1234567892', 3, 3, N'活期存款', 3000, 1);
GO

-- 建立範例交易

INSERT INTO [Transaction] (AccountID, AtmID, Type, Content, Amount, UpdatedBy)
VALUES (1, 1, N'存款', N'存款 100 元', 100, 1),
       (1, 2, N'提款', N'提款 200 元', 200, 1),
       (2, 2, N'轉入', N'轉入 300 元', 300, 1),
       (2, 3, N'轉出', N'轉出 400 元', 400, 1),
       (3, 3, N'存款', N'存款 500 元', 500, 1),
       (3, 3, N'轉出', N'轉出 600 元', 600, 1);
GO
