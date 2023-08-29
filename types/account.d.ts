/** 銀行帳戶 */
interface Account {
	id: number;
	accountId: string;
	customer: Customer;
	branchId: number;
	type: string;
	balance: number;
	updatedAt: Date;
	updatedBy: SystemUser;
	deletedAt: Date | null;
}

/** 銀行帳戶 DTO */
interface AccountDto {
	accountId: string;
	customerId: Customer['id'];
	branchId: number;
	type: string;
	balance: number;
	updatedBy: SystemUser['id'];
}

/** 銀行帳戶 Schema（資料庫） */
interface AccountRecord {
	ID: number;
	AccountID: string;
	CustomerID: Customer['id'];
	BranchID: number;
	Type: '活期存款' | '定期存款';
	Balance: number;
	UpdatedAt: Date;
	UpdatedBy: SystemUser['id'];
	DeletedAt: Date | null;
}

/** 銀行帳戶資料庫查詢結果 */
type AccountResult = AccountRecord & {
	UpdatedByUserName: SystemUser['username'];
	UpdatedByName: SystemUser['name'];
};
