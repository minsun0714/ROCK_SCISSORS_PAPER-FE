import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/shared/api/apiClient";

export type Move = "ROCK" | "SCISSORS" | "PAPER";

export type BattleMessage = {
  type: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

type GamePhase = "connecting" | "lobby" | "waiting" | "playing" | "result" | "disconnected" | "closed";

export type RoundResult = {
  myMove?: Move;
  opponentMove?: Move;
  result?: "WIN" | "LOSE" | "DRAW";
  roundNumber?: number;
};

const toWsUrl = (httpUrl: string) => {
  return httpUrl.replace(/^http/, "ws") + "/ws";
};

export const useBattleWebSocket = (roomId?: string, myUserId?: number) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [phase, setPhase] = useState<GamePhase>("connecting");
  const [messages, setMessages] = useState<BattleMessage[]>([]);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [myMove, setMyMove] = useState<Move | null>(null);
  const [closedMessage, setClosedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    const token = localStorage.getItem("accessToken");
    const rawToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    const url = `${toWsUrl(API_BASE_URL)}?roomId=${encodeURIComponent(roomId)}${rawToken ? `&token=${encodeURIComponent(rawToken)}` : ""}`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      if (cancelled) {
        ws.close();
        return;
      }

      wsRef.current = ws;

      setPhase("lobby");
    };

    ws.onmessage = (event) => {
      if (cancelled) return;

      try {
        const msg: BattleMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);

        const type = msg.type as string;

        if (type === "BATTLE_START" || type === "START" || type === "GAME_START" || type === "ROUND_START") {
          setPhase("playing");
          setMyMove(null);
          setRoundResult(null);
        } else if (type === "WAITING" || type === "WAIT") {
          setPhase("waiting");
        } else if (type === "BATTLE_FINISHED") {
          const d = msg.data ?? msg;
          const requesterId = d.requesterId as number | undefined;
          const isRequester = myUserId != null && requesterId === myUserId;

          const myMoveResult = (
            isRequester ? d.requesterMove : d.opponentMove
          ) as Move | undefined;
          const opponentMoveResult = (
            isRequester ? d.opponentMove : d.requesterMove
          ) as Move | undefined;
          const winnerUserId = d.winnerUserId as number | null | undefined;

          let result: "WIN" | "LOSE" | "DRAW";
          if (winnerUserId == null) {
            result = "DRAW";
          } else if (winnerUserId === myUserId) {
            result = "WIN";
          } else {
            result = "LOSE";
          }

          setPhase("result");
          setRoundResult({
            myMove: myMoveResult,
            opponentMove: opponentMoveResult,
            result,
            roundNumber: d.roundNumber as number | undefined,
          });
        } else if (type === "ROOM_CLOSED") {
          setClosedMessage(typeof msg.data === "string" ? msg.data : "대전이 종료되었습니다.");
          setPhase("closed");
        }
      } catch {
        // non-JSON message, ignore
      }
    };

    ws.onclose = () => {
      if (cancelled) return;
      setPhase((prev) => (prev === "closed" ? prev : "disconnected"));
    };

    ws.onerror = (event) => {
      if (cancelled) return;
      console.error("[WS] Error:", event);
    };

    return () => {
      cancelled = true;
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, myUserId]);

  const sendMove = useCallback((move: Move) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "CHOICE", move }));
      setMyMove(move);
      setPhase("waiting");
    }
  }, []);

  const sendRetry = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "RETRY" }));
      setMyMove(null);
      setRoundResult(null);
      setPhase("playing");
    }
  }, []);

  return {
    phase,
    messages,
    myMove,
    roundResult,
    closedMessage,
    sendMove,
    sendRetry,
  };
};
