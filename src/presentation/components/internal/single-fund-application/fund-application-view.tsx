'use client';

import { CompetitionView } from './competition-view';
import { DocumentsView } from './documents-view';
import { FundApplicationDto, FundApplicationMapper } from '@app/infrastructure/dtos';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialFundApplication: FundApplicationDto;
};

export function FundApplicationView({ initialFundApplication }: Props) {
  const fundApplication = FundApplicationMapper.fromDtoToDomain(initialFundApplication);

  return (
    <>
      <GeneralView fundApplication={fundApplication} />
      <CompetitionView fundApplication={fundApplication} />
      <DocumentsView fundApplication={fundApplication} />
      <MetadataView fundApplication={fundApplication} />
    </>
  );
}
