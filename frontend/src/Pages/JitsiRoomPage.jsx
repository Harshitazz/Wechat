import { Box, Button } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

function JitsiRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <Box width="100%" height="100vh" position="relative">
      <Button
        position="absolute"
        top="10px"
        left="10px"
        zIndex="10"
        colorScheme="red"
        onClick={() => navigate("/chats")}
      >
        Leave Call
      </Button>

      <iframe
  src={`https://meet.jit.si/${roomId}
    #userInfo.displayName=Host
    &config.prejoinPageEnabled=false
    &config.enableLobbyChat=false`}
  allow="camera; microphone; fullscreen; display-capture"
  style={{ width: "100%", height: "100%", border: "none" }}
  title="Jitsi Meet"
/>

    </Box>
  );
}

export default JitsiRoomPage;
