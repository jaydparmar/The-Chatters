import React from 'react'
import { HStack, Avatar, Text, Wrap, WrapItem, Button, color } from '@chakra-ui/react'
const Message = ({ text, uri, user = "other", name }) => {
  return (

    <HStack alignSelf={user === "me" ? "flex-end" : "flex-start"} borderRadius={"base"} bg={"gray.100"} paddingY={"2"} paddingX={user === "me" ? "4" : "2"}>
      {
        user === "other" && <Avatar src={uri} />
      }
      <Text style= {{ whiteSpace: 'unset', fontWeight: "400", color:"black"}}> {name} : {text}</Text>
      
      {
        user === "me" && <Avatar src={uri} />   
      }

    </HStack>
  )
}

export default Message
