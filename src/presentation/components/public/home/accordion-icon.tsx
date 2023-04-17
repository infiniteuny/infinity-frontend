import { KeyboardArrowDownRounded, KeyboardArrowUpRounded } from '@mui/icons-material';

type Props = {
  id: number;
  open: number;
};

export function AccordionIcon({ id, open }: Props) {
  if (id === open) {
    return (
      <div className="flex items-center justify-center h-7 w-7 bg-white rounded-full">
        <KeyboardArrowUpRounded className="align-text-bottom fill-infinite-green" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-7 w-7 bg-infinite-green rounded-full">
        <KeyboardArrowDownRounded className="align-text-bottom fill-white" />
      </div>
    );
  }
}
