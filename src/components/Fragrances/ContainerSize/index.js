import { useState, useRef } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { isVolumeValid } from '@/utils/validation/fragrances';
import Content from '@/content';

const ContainerSize = ({ selectedContainerSize, sizes, updateSelectedSize }) => {
  const shouldFocusRef = useRef(false);
  const [customVol, setCustomVol] = useState(undefined);
  const handleCustomVolSelection = (customVolNum) => {
    shouldFocusRef.current = true;
    setCustomVol(customVolNum);
  };
  const [selectedVol, setSelectedVol] = useState(selectedContainerSize);
  const handleSizeSelection = (type, selectedSize) => {
    // Set the radio button which was selected
    setSelectedVol(selectedSize);

    // For pre-defined radio button sizes, the actual size IS the selected radio value
    if (type === "predef") {
      if (isVolumeValid(selectedSize)) {
        shouldFocusRef.current = false;
        updateSelectedSize(selectedSize);
      }
    } else if (type === "custom") {
      // If we have a reference to the Textfield, we focus on it
      shouldFocusRef.current = true;
      // Else if we're looking at the custom textfield, the size for the custom value is stored in another state
      if (isVolumeValid(selectedSize)) {
        updateSelectedSize(customVol);
      }
    }
  };

  return (
      <FormControl>
        <RadioGroup
          row
          aria-label={Content('en').pages.fragrances.containerSizes.ariaLabel}
          name={Content('en').pages.fragrances.containerSizes.name}
          defaultValue="top"
          value={selectedVol}
        >
          {sizes.map((eachSize) => (
            <FormControlLabel
              key={Math.random()}
              control={<Radio color="primary" />}
              label={`${eachSize} ml`}
              value={eachSize}
              labelPlacement="top"
              onChange={(e) => { handleSizeSelection('predef', Number(e.target.value)) }}
            />
          ))}
          <FormControlLabel
            key={Math.random()}
            control={<Radio color="primary" />}
            label={
              <TextField
                type="number"
                value={customVol}
                onChange={(e) => handleCustomVolSelection(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ml</InputAdornment>,
                }}
                style={{ width: '10ch' }}
                inputRef={(input) => {
                  if (input !== null) {
                    if (shouldFocusRef.current) {
                      input.focus();
                    } else {
                      input.blur();
                    }
                  }
                }}
              />
            }
            value={'custom'}
            labelPlacement="top"
            onChange={(e) => { handleSizeSelection('custom', e.target.value) }}
          />
        </RadioGroup>
      </FormControl>
      
  );
};

export default ContainerSize;
