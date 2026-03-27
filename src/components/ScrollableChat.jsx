/*import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {isLastMessage, isSameSender} from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'
const ScrollableChat = ({messages}) => {

    const {user}=ChatState();
   
  return (
  <ScrollableFeed>
  {messages &&
    messages.map((m, i) => {

      
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
          key={m._id}
        >
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}

          <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
            <span
              style={{
                backgroundColor:
                  m.sender._id.toString() === user._id.toString()
                    ? "#BEE3F8"
                    : "#B9F5D0",

                marginLeft:
                  m.sender._id.toString() === user._id.toString()
                    ? "auto"
                    : "0px",

                marginTop: "3px",
                padding: "5px 15px",
                borderRadius: "20px",
                maxWidth: "75%",
                cursor: "pointer",
              }}
            >
              {m.content}
            </span>
          </Tooltip>
        </div>
      );
    })}
</ScrollableFeed>
  )
}

export default ScrollableChat*/






import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {isLastMessage, isSameSender} from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {

  const {user} = ChatState();
  

  return (
    <ScrollableFeed>
      {messages?.map((m, i) => {

        // ✅ agar sender hi nahi hai to skip kar do
        if (!m?.sender) return null;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <Tooltip label={m.sender?.name || ""} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender?.name || ""}
                  src={m.sender?.pic}
                />
              </Tooltip>
            )}

            <Tooltip label={m.sender?.name || ""} placement="bottom-start" hasArrow>
              <span
                style={{
                  backgroundColor:
                    m.sender?._id?.toString() === user?._id?.toString()
                      ? "#BEE3F8"
                      : "#B9F5D0",

                  marginLeft:
                    m.sender?._id?.toString() === user?._id?.toString()
                      ? "auto"
                      : "0px",

                  marginTop: "3px",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  cursor: "pointer",
                }}
              >
                {m.content}
              </span>
            </Tooltip>
          </div>
        );
      })}
    </ScrollableFeed>
  )
}

export default ScrollableChat