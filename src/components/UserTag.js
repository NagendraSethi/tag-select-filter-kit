
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './UserTag.css';

const UserTag = ({ user, onRemove }) => {
  return (
    <div className="user-tag">
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
        {user.role && <div className="user-role">{user.role}</div>}
      </div>
      {onRemove && (
        <button 
          className="remove-btn" 
          onClick={() => onRemove(user)}
          aria-label="Remove user"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

export default UserTag;
