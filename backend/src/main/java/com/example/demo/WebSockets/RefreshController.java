package com.example.demo.WebSockets;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class RefreshController {

    private final SimpMessagingTemplate messagingTemplate;

    public RefreshController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/startGame")
    public void triggerStartGame(String payload) {
        messagingTemplate.convertAndSend("/topic/startGame", "startGame");
    }
}