import { Box, Button, Container, VStack, Input, HStack } from '@chakra-ui/react'
import Message from './Components/Message'
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { app } from "./firebase"
import { useEffect, useRef, useState } from 'react';
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore"
const auth = getAuth();
const db = getFirestore(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}
const logoutHandler = () => {
  auth.signOut();
}

function App() {
  const [user, setuser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const MyScroll = useRef(null);
  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setuser(data);
    })
    const unsubscribeMessage = onSnapshot(q, collection(db, "Messages"), (snap) => {
      setMessages(snap.docs.map((item) => {
        const id = item.id;
        return { id, ...item.data() };
      }));

    });
    return () => {
      unsubscribe();
      unsubscribeMessage();
    };
  }, []);
  useEffect(()=>{
    if(MyScroll.current)
      {
        MyScroll.current.scrollIntoView({ behavior : "smooth"}); 
      }
  },[messages, MyScroll.current])
  const SubmitHandler = async (e) => {
    e.preventDefault();
    if(message.trim()){
      try {
        setMessage("");
        await addDoc(collection(db, "Messages"), {
          text: message,
          uid: user.uid,
          uri: user.photoURL,
          createdAt: serverTimestamp(),
          name:user.displayName,
          
        });
        MyScroll.current.scrollIntoView({ behavior: "smooth" });
      }
      catch (error) {
        alert(error);
      }
  }
  }
  return (
    <Box bg={"red.50"}>
      {
        user ? (
          <Container h={"100vh"} bg="white">
            <VStack h="full" paddingY={"4"}>
              <Button onClick={logoutHandler} style={{ border: "none" }} colorScheme={"red"} w={"full"}>LogOut</Button>
              <VStack h={"full"} w={"full"} overflowY={"auto"} css={{
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }}>
                {
                  messages.length > 0  && messages.map(item => (
                    console.log(item.name),
                    <Message
                      key={item.id}
                      user={item.uid === user.uid ? "me" : "other"}
                      text={item.text}
                      uri={item.uri}
                      name={item.name} 
                      />
                  ))
                }
                {
                  messages.length > 0 && <div ref={MyScroll}></div>
                }
              </VStack>
              <form onSubmit={SubmitHandler} style={{ width: "100%" }}>
                <HStack>
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter a Message' />
                  <Button colorScheme={"purple"} type="submit">Send</Button>
                </HStack>
              </form>
            </VStack>
          </Container>
        ) : (
          <VStack justifyContent={"center"} h="100vh" >
            <Button onClick={loginHandler}>SignIn with Google</Button>
          </VStack>
        )}
    </Box>
  );
}

export default App;
