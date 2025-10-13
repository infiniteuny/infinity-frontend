import { PaginationOptions } from '@app/domain/entities';

export interface PaginationOptionsDto {
  per_page: number;
  next_cursor?: string;
  previous_cursor?: string;
}

export class PaginationOptionsMapper {
  public static fromDomaintoDto(
    paginationOptions: Partial<PaginationOptions>,
  ): Partial<PaginationOptionsDto> {
    return {
      per_page: paginationOptions.perPage,
      next_cursor: paginationOptions.nextCursor,
      previous_cursor: paginationOptions.previousCursor,
    };
  }

  public static fromDtoToDomain(dto: PaginationOptionsDto): PaginationOptions {
    return new PaginationOptions(dto.per_page, dto.next_cursor, dto.previous_cursor);
  }
}
