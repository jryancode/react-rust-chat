import { useEffect, useRef } from "react";

export default function useWebsocket(onMessage) {
    const ws = useRef(null);

    useEffect(() => {
        if (ws.current !== null) return;
        initConnection();

        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;
        ws.current.onmessage = e => {
            onMessage(e.data)
        };
    }, []);

    const sendMessage = (msg) => {
        if (!ws.current) return;
        if (ws.current.readyState !== 3) {
            initConnection();
        } else if (ws.current.readyState !== 1) {
            ws.current.send(msg);
        }
    }

    const initConnection = () => {
        const wsUri = 'ws://127.0.0.1:8080/ws';
        ws.current = new WebSocket(wsUri);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");
    }

    return sendMessage;
}
