import { User } from "lucide-react";

/*export const getSender = (loggedUser, users) => {
  /*const otherUser = users.find((u) => u._id !== loggedUser._id);
  return otherUser?.name;*/

  /*return users[0]._id===loggedUser._id?users[1].name:users[0].name;
};
  
export const getSenderFull = (loggedUser, users) => {
  
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender._id !== m.sender._id &&
    m.sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId
  );
};*/


export const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length === 0) return "";

  const otherUser = users.find((u) => u?._id !== loggedUser?._id);

  // ✅ agar otherUser nahi mila, to first user ka naam dikha do
  return otherUser?.name || users[0].name || "";
};

export const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users) return null;

  return users.find((u) => u?._id !== loggedUser?._id) || null;
};

export const isSameSender = (messages, m, i, userId) => {
  if (!messages || !m?.sender) return false;

  const nextMessage = messages[i + 1];

  return (
    nextMessage?.sender?._id !== m.sender._id &&
    m.sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  if (!messages || messages.length === 0) return false;

  const lastMessage = messages[messages.length - 1];

  return (
    i === messages.length - 1 &&
    lastMessage?.sender?._id !== userId
  );
};