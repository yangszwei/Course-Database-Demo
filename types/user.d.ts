/** 系統使用者 */
interface SystemUser {
	id: number;
	username: string;
	name: string;
}

/** 系統使用者 DTO */
interface SystemUserDto {
	username: string;
	name: string;
	password: string;
}

/** 系統使用者登入 DTO */
interface SystemUserLoginDto {
	username: string;
	password: string;
}

/** 系統使用者 Schema（資料庫） */
interface SystemUserRecord {
	ID: number;
	UserName: string;
	Name: string;
	Password: string;
	DeletedAt: Date;
}
