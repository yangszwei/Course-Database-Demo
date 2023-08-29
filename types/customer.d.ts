/** 客戶 */
interface Customer {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	country: string;
	city: string;
	address: string;
	updatedAt: Date;
	updatedBy: SystemUser;
	deletedAt: Date;
}

/** 客戶個人資料 */
type CustomerProfile = Pick<Customer, 'id' | 'username' | 'firstName' | 'lastName'>;

/** 客戶 DTO */
interface CustomerDto {
	username: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	country: string;
	city: string;
	address: string;
	password: string;
	updatedBy: SystemUser['id'];
}

/** 客戶登入 DTO */
interface CustomerLoginDto {
	username: string;
	password: string;
}

/** 客戶 Schema（資料庫） */
interface CustomerRecord {
	ID: number;
	UserName: string;
	FirstName: string;
	LastName: string;
	BirthDate: Date;
	Country: string;
	City: string;
	Address: string;
	UpdatedAt: Date;
	UpdatedBy: SystemUser['id'];
	DeletedAt: Date | null;
}

/** 客戶資料庫查詢結果 */
type CustomerResult = CustomerRecord & {
	UpdatedByUserName: SystemUser['username'];
	UpdatedByName: SystemUser['name'];
};
