export class PaginationOptions {
  public perPage: number;
  public nextCursor?: string;
  public previousCursor?: string;

  public constructor(perPage: number, nextCursor?: string, previousCursor?: string) {
    this.perPage = perPage;
    this.nextCursor = nextCursor;
    this.previousCursor = previousCursor;
  }
}
