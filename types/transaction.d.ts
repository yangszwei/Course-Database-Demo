/** 交易紀錄 */
interface Transaction {
	id: number;
	account: Account;
	atmId: number;
	type: '存款' | '提款' | '轉入' | '轉出';
	content: string;
	amount: number;
	issuedAt: Date;
	updatedAt: Date;
	updatedBy: SystemUser;
}

/** 交易紀錄 DTO */
interface TransactionDto {
	accountId: Account['id'];
	atmId: Transaction['atmId'];
	type: Transaction['type'];
	content: Transaction['content'];
	amount: Transaction['amount'];
	issuedAt: Transaction['issuedAt'];
	updatedBy: SystemUser['id'];
}

/** 交易紀錄 Filter */
interface TransactionFilter {
	accountId: Account['id'];
}

/** 交易紀錄 Schema（資料庫） */
interface TransactionRecord {
	ID: number;
	AccountID: AccountRecord['ID'];
	AtmID: number;
	Type: '存款' | '提款' | '轉入' | '轉出';
	Content: string;
	Amount: number;
	IssuedAt: Date;
	UpdatedAt: Date;
	UpdatedBy: SystemUserRecord['ID'];
}
