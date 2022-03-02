import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../actions';
import '../App.css';

function AddTrainer() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ task: '', taskDesc: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const addUser = () => {
    if ( document.getElementById('name').value !== '' ){
        dispatch(actions.createTrainer(formData.name));
    document.getElementById('name').value = '';
    }
    
  };
  return (
    <div className="add">
      <div className="input-selection">
        <h3>New Trainer</h3>
        <label>
          <input
            onChange={(e) => handleChange(e)}
            id="name"
            name="name"
            placeholder="Name..."
          />
        </label>
      </div>
      <button className="navlink" onClick={addUser}>Add Trainer</button>
    </div>
  );
}

export default AddTrainer;