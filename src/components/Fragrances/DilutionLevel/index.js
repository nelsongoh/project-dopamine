import { useState } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { isDilutionValid } from '@/utils/validation/fragrances';
import Content from '@/content';

const DilutionLevel = ({ selectedDilutionLevel, levels, updateSelectedLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState(selectedDilutionLevel);
  const handleLevelSelection = (value) => {
    // Set the radio button which was selected
    setSelectedLevel(value);

    // Check to see if the selected level is valid
    if (isDilutionValid(value)) {
      updateSelectedLevel(value);
    }
  }

  return (
    <FormControl>
      <RadioGroup
        row
        aria-label={Content('en').pages.fragrances.dilutionLevels.ariaLabel}
        name={Content('en').pages.fragrances.dilutionLevels.name}
        defaultValue="top"
        value={selectedLevel}
      >
        {levels.map((eachLevel) => (
          <FormControlLabel
            key={Math.random()}
            control={<Radio color="primary" />}
            label={`${eachLevel} %`}
            value={eachLevel}
            labelPlacement="top"
            onChange={(e) => { handleLevelSelection(Number(e.target.value)) }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default DilutionLevel;
