import {useEffect, useState} from 'react';
import CreatableSelect from 'react-select/creatable';

export const ReactSelect = ({tags, getSelectedTag}) => {
  const options = tags.map((ele) => ({
    value: ele,
    label: ele,
  }));

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCreateOption = (inputValue) => {
    const newOption = {value: inputValue, label: inputValue};
    setSelectedOptions([...selectedOptions, newOption]);
    getSelectedTag([...selectedOptions, newOption]);
  };

  useEffect(() => {
    getSelectedTag(selectedOptions);
  }, [selectedOptions]);

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={selectedOptions}
      onChange={(selected) => {
        setSelectedOptions(selected);
      }}
      onCreateOption={handleCreateOption}
      placeholder="Select options"
      isSearchable
      isClearable
    />
  );
};
