import React from 'react';
import { useState } from 'react';
import Select, { SingleValue } from 'react-select';

type SelectionOption = {
  value?: string;
  label?: string;
};

function TemplateFiltering() {
  const type_options = [
    { value: '', label: 'Select' },
    { value: 'Other Page', label: 'Other Page' },
    { value: 'Country Page', label: 'Country Page' },
  ];
  const status_options = [
    { value: '', label: 'Select' },
    { value: 'Live', label: 'Live' },
    { value: 'InActive', label: 'In Active' },
  ];
  const [type, setType] = useState<SelectionOption>(type_options[0]);
  const [status, setStatus] = useState<SelectionOption>(status_options[0]);
  const handleStatusChange = (newValue: SingleValue<SelectionOption>) => {
    setStatus({ ...newValue });
  };
  const handleTypeChange = (newValue: SingleValue<SelectionOption>) => {
    setType({ ...newValue });
  };

  return (
    <div className="flex flex-col md:flex-row w-full justify-between items-center mt-5">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div>
          <label htmlFor="from" className="mx-2">
            From
          </label>
        </div>
        <div>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            name="from"
            id="from" // Add id attribute for the input element
          />
        </div>
        <div>
          <label htmlFor="to" className="mx-2">
            To
          </label>
        </div>
        <div>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            name="to"
            id="to" // Add id attribute for the input element
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="mx-4">Type : </span>
        <Select
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              zIndex: 20,
              fontSize: '1rem',
              width: '200px',
            }),
            option: (baseStyles, { isFocused, isSelected }) => ({
              ...baseStyles,
              backgroundColor: isSelected ? '#019cd2' : '',
              color: isSelected ? 'white' : 'black',
              position: 'relative',
              fontSize: '1rem',
              ':hover': {
                backgroundColor: '#019cd240',
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              fontSize: '1rem',
              zIndex: 20,
            }),
          }}
          options={type_options}
          value={type}
          onChange={handleTypeChange}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="mx-4">Status : </span>
        <Select
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              zIndex: 20,
              fontSize: '1rem',
              width: '200px',
            }),
            option: (baseStyles, { isFocused, isSelected }) => ({
              ...baseStyles,
              backgroundColor: isSelected ? '#019cd2' : '',
              color: isSelected ? 'white' : 'black',
              position: 'relative',
              fontSize: '1rem',
              ':hover': {
                backgroundColor: '#019cd240',
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              fontSize: '1rem',
              zIndex: 20,
            }),
          }}
          options={status_options}
          value={status}
          onChange={handleStatusChange}
        />
      </div>
    </div>
  );
}

export default TemplateFiltering;
