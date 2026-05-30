import { useNavigate } from "react-router";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";
import { useCallback } from "react";
import { Background } from "../components/background";

export function Home() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (text: string) => {
      navigate("/session/new", { state: { message: text } });
    },
    [navigate]
  );
  const name = "John";

  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={2}
      position="relative"
      width={"100%"}
      height={"100%"}
    >
      <Background />
      <Header />
      <box width={"100%"} maxWidth={80} paddingX={2}>
        <box paddingX={1} flexDirection="row" gap={1}>
          <text>Hello</text>
          <text fg={"gray"}>{name}</text>
          <text>What are we fixing today?</text>
        </box>
        <InputBar onSubmit={handleSubmit} />
      </box>
    </box>
  );
}
