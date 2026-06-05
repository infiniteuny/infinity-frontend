import { FilterOperator } from '@app/domain/entities';

export const convertDateFilterOperator = (operator: string): FilterOperator | undefined => {
  switch (operator) {
    case 'is':
      return FilterOperator.EQUAL;
    case 'not':
      return FilterOperator.NOT_EQUAL;
    case 'after':
      return FilterOperator.GREATER_THAN;
    case 'onOrAfter':
      return FilterOperator.GREATER_THAN_OR_EQUAL;
    case 'before':
      return FilterOperator.LESS_THAN;
    case 'onOrBefore':
      return FilterOperator.LESS_THAN_OR_EQUAL;
  }
};
