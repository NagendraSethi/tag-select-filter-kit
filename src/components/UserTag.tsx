
import React from 'react';
import { X } from "lucide-react";
import { User } from "./PodForm";

interface UserTagProps {
  user: User;
  onRemove: () => void;
}

export const UserTag: React.FC<UserTagProps> = ({ user, onRemove }) => {
  return (
    <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1 text-sm flex items-center gap-1 group max-w-[250px]">
      <div className="truncate">
        <span className="font-medium">@{user.email.split('@')[0]}</span>
        {user.role && <span className="text-gray-600"> ({user.role})</span>}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className="text-red-600 hover:text-red-800 ml-1 p-1 rounded-full hover:bg-red-100"
        title="Remove user"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};
