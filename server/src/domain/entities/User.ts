export interface User {
  user_id: number;
  user_name: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export class UserEntity implements User {
  constructor(
    public user_id: number,
    public user_name: string,
    public email: string,
    public password_hash: string,
    public first_name: string,
    public last_name: string,
    public created_at: Date,
    public updated_at: Date
  ) { }

  static create(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): UserEntity {
    const now = new Date();
    return new UserEntity(
      0, // Will be set by database
      userData.user_name,
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name,
      now,
      now
    );
  }

  updateProfile(name: string, email: string): void {
    this.user_name = name;
    this.email = email;
    this.updated_at = new Date();
  }
}