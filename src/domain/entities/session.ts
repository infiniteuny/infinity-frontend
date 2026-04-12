export class Session {
  public user: {
    id: string;
    name: string;
    username: string;
    emailAddress: string;
    picture?: string;
  };
  public expiresAt: Date;

  public constructor(
    user: {
      id: string;
      name: string;
      username: string;
      emailAddress: string;
      picture?: string;
    },
    expiresAt: Date,
  ) {
    this.user = user;
    this.expiresAt = expiresAt;
  }
}
