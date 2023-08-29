USE master;

-- 建立或重新建立 NtunhsAtm 資料庫

IF DB_ID('NtunhsAtm') IS NOT NULL
    DROP DATABASE [NtunhsAtm];
GO

CREATE DATABASE [NtunhsAtm];
GO

--

USE [NtunhsAtm];

-- 新增「系統使用者」資料表

CREATE TABLE [SystemUser]
(
    ID        INT PRIMARY KEY IDENTITY (1, 1), -- 編號
    UserName  VARCHAR(50)    NOT NULL UNIQUE,  -- 使用者名稱
    Name      NVARCHAR(100)  NOT NULL,         -- 顯示名稱
    Password  VARBINARY(MAX) NOT NULL,         -- 密碼
    DeletedAt DATETIME                         -- 刪除時間
);
GO

-- 新增「客戶」資料表

CREATE TABLE [Customer]
(
    ID        INT PRIMARY KEY IDENTITY (1, 1),           -- 編號
    UserName  VARCHAR(50)    NOT NULL UNIQUE,            -- 使用者名稱
    FirstName NVARCHAR(50)   NOT NULL,                   -- 名字
    LastName  NVARCHAR(50)   NOT NULL,                   -- 姓氏
    BirthDate DATE           NOT NULL,                   -- 生日
    Country   NVARCHAR(50)   NOT NULL,                   -- 國家
    City      NVARCHAR(50)   NOT NULL,                   -- 城市
    Address   NVARCHAR(255)  NOT NULL,                   -- 地址
    Password  VARBINARY(MAX) NOT NULL,                   -- 密碼
    UpdatedAt DATETIME       NOT NULL DEFAULT GETDATE(), -- 更新時間
    UpdatedBy INT            NOT NULL,                   -- 更新人員
    DeletedAt DATETIME,                                  -- 刪除時間

    FOREIGN KEY (UpdatedBy) REFERENCES SystemUser (ID)
);
GO

-- 新增「銀行帳戶」資料表

CREATE TABLE [Account]
(
    ID         INT PRIMARY KEY IDENTITY (1, 1),           -- 編號
    AccountID  VARCHAR(10)    NOT NULL UNIQUE,            -- 帳號
    CustomerID INT            NOT NULL,                   -- 客戶編號
    BranchID   INT            NOT NULL,                   -- 分行編號
    Type       NCHAR(4)       NOT NULL,                   -- 帳戶類型
    Balance    DECIMAL(10, 2) NOT NULL DEFAULT 0,         -- 餘額
    UpdatedAt  DATETIME       NOT NULL DEFAULT GETDATE(), -- 更新時間
    UpdatedBy  INT            NOT NULL,                   -- 更新人員
    DeletedAt  DATETIME,                                  -- 刪除時間

    FOREIGN KEY (CustomerID) REFERENCES Customer (ID) ON UPDATE CASCADE,
    CHECK (Type IN (N'活期存款', N'定期存款')),
    FOREIGN KEY (UpdatedBy) REFERENCES SystemUser (ID)
);
GO

-- 新增「交易紀錄」資料表

CREATE TABLE [Transaction]
(
    ID        INT PRIMARY KEY IDENTITY (1, 1),           -- 交易編號
    AccountID INT            NOT NULL,                   -- 帳戶編號
    AtmID     INT            NOT NULL,                   -- ATM編號
    Type      NCHAR(2)       NOT NULL,                   -- 交易類型
    Content   NVARCHAR(255)  NOT NULL,                   -- 交易內容
    Amount    DECIMAL(10, 2) NOT NULL,                   -- 交易金額
    IssuedAt  DATETIME       NOT NULL DEFAULT GETDATE(), -- 交易時間
    UpdatedAt DATETIME       NOT NULL DEFAULT GETDATE(), -- 更新時間
    UpdatedBy INT,                                       -- 更新人員

    FOREIGN KEY (AccountID) REFERENCES Account (ID) ON DELETE CASCADE,
    CHECK (Type IN (N'存款', N'提款', N'轉入', N'轉出')),
    FOREIGN KEY (UpdatedBy) REFERENCES SystemUser (ID) ON DELETE SET NULL
);
GO
