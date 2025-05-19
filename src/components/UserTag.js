
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './UserTag.css';

const UserTag = ({ user, onRemove }) => {
  return (
    <div className="user-tag">
      <div className="user-tag-content">
        <span className="user-tag-username">@{user.email.split('@')[0]}</span>
        {user.role && <span className="user-tag-role"> ({user.role})</span>}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className="user-tag-remove-btn"
        title="Remove user"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default UserTag;
