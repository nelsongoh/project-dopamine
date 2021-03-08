import { useRef, useState } from 'react';
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
    updateSelectedSize({selected: "custom", value: customVolNum});
  };
  const handleSizeSelection = (type, selectedSize) => {
    // For pre-defined radio button sizes, the actual size IS the selected radio value
    if (type === "predef") {
      if (isVolumeValid(selectedSize)) {
        shouldFocusRef.current = false;
        updateSelectedSize({selected: selectedSize, value: selectedSize});
      }
    } else if (type === "custom") {
      // If we have a reference to the Textfield, we focus on it
      shouldFocusRef.current = true;
      // Else if we're looking at the custom textfield, the size for the custom value is stored in another state
      if (isVolumeValid(customVol || selectedContainerSize.value)) {
        updateSelectedSize({selected: type, value: customVol || selectedContainerSize.value});
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
          value={selectedContainerSize.selected}
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
                value={customVol || selectedContainerSize.value}
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
            onChange={() => { handleSizeSelection('custom') }}
          />
        </RadioGroup>
      </FormControl>
      
  );
};

export default ContainerSize;
