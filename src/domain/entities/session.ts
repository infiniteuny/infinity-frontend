export class Session {
  public user: {
    id: string;
    name: string;
    username: string;
    emailAddress: string;
    picture?: string;
  };
  public accessToken: string;
  public expiresAt: Date;

  public constructor(
    user: {
      id: string;
      name: string;
      username: string;
      emailAddress: string;
      picture?: string;
    },
    accessToken: string,
    expiresAt: Date,
  ) {
    this.user = user;
    this.accessToken = accessToken;
    this.expiresAt = expiresAt;
  }
}
