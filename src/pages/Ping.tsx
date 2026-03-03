import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateMyStatusMessage } from "@/service/userService";

function Ping() {
  const [statusMessage, setStatusMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const updateStatusMutation = useMutation({
    mutationFn: updateMyStatusMessage,
    onSuccess: () => {
      setResultMessage("상태 메시지가 변경되었습니다.");
    },
    onError: () => {
      setResultMessage("상태 메시지 변경에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = statusMessage.trim();
    if (!trimmed) {
      setResultMessage("상태 메시지를 입력해주세요.");
      return;
    }

    updateStatusMutation.mutate({ statusMessage: trimmed });
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>Ping 페이지</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={statusMessage}
          onChange={(event) => setStatusMessage(event.target.value)}
          placeholder="상태 메시지를 입력하세요"
        />
        <button type="submit" disabled={updateStatusMutation.isPending}>
          {updateStatusMutation.isPending ? "저장 중..." : "상태 메시지 저장"}
        </button>
      </form>
      {resultMessage && <p>{resultMessage}</p>}
    </main>
  );
}

export default Ping;
