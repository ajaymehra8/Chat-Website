import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { Tooltip,Avatar } from '@chakra-ui/react';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic'
import { useChatState } from '../Context/ChatProvider'

const ScrollableChat = ({messages}) => {

    const {user}=useChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((m,i)=>{
        console.log(user.id,m.sender._id);
        return(
        
        <div
        style={{display:"flex"}}
        key={m._id}
        >
{
    (
        isSameSender(messages,m,i,user.id) || isLastMessage(messages,i,user.id)
    
    ) && (
        <Tooltip
        label={m.sender.name}
        placement='bottom-start'
        hasArrow
        >
 <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
        </Tooltip>
    )
}

<span style={{
    background:`${m.sender._id===user.id ? "#BEE3F8":"#89F5D0"}`,
    borderRadius:"20px",
    padding:"5px 15px",
    maxWidth:"75%",
    marginLeft:isSameSenderMargin(messages,m,i,user.id),
    marginTop:isSameUser(messages,m,i,user.id)?3:10
}}>
{m.content}
</span>
        </div>
      )}
      )}
    </ScrollableFeed>
  )
}

export default ScrollableChat
