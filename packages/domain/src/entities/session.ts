export class Session {
  public user: {
    id: string;
    name: string;
    username: string;
    emailAddress: string;
    picture?: string;
  };
  public permissions: string[];
  public expiresAt: Date;

  public constructor(
    user: {
      id: string;
      name: string;
      username: string;
      emailAddress: string;
      picture?: string;
    },
    permissions: string[],
    expiresAt: Date,
  ) {
    this.user = user;
    this.permissions = permissions;
    this.expiresAt = expiresAt;
  }
}
