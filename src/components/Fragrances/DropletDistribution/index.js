import { Fragment } from 'react';
import NoteScaffold from '@/components/Fragrances/NoteScaffold';
import DropletCounter from './DropletCounter';

const DropletDistribution = () => {
  return (
    <NoteScaffold
      topNoteContent={
        <Fragment>
          <DropletCounter />
          <DropletCounter />
        </Fragment>
      }
    />
  )
};

export default DropletDistribution;
