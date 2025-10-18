export class PaginationOptions {
  public perPage: number;
  public cursor?: string;
  public nextCursor?: string;
  public previousCursor?: string;

  public constructor(
    perPage: number,
    cursor?: string,
    nextCursor?: string,
    previousCursor?: string,
  ) {
    this.perPage = perPage;
    this.cursor = cursor;
    this.nextCursor = nextCursor;
    this.previousCursor = previousCursor;
  }
}
