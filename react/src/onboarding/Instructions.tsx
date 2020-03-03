import * as React from 'react';
import { ReactComponent as InstructionsIcon } from '../assets/icons/instructions.svg';
import './Instructions.css';

const InstructionsContainer: React.FunctionComponent = () => {
  return (
    <div>
      <button className="Instructions-button">
        <InstructionsIcon />
      </button>
    </div>
  );
};

export default InstructionsContainer;
