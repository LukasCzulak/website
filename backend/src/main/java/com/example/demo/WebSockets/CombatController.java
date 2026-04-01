package com.example.demo.WebSockets;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.List; // Make sure to import this!

@Controller
public class CombatController {

    private CombatState currentState = new CombatState();

    @MessageMapping("/combat/start")
    @SendTo("/topic/combat/state")
    public CombatState startCombat(@Payload List<String> initiativeOrder) {
        if (initiativeOrder == null || initiativeOrder.isEmpty()) {
            return currentState;
        }
        
        currentState.setInCombat(true);
        currentState.setRound(1);
        currentState.setTurnIndex(0);
        currentState.setTurnOrder(initiativeOrder);
        
        return currentState;
    }

    @MessageMapping("/combat/nextTurn")
    @SendTo("/topic/combat/state")
    public CombatState nextTurn() {
        if (!currentState.isInCombat()) return currentState;

        int nextIndex = currentState.getTurnIndex() + 1;
        
        if (currentState.getTurnOrder().size() > 0 && nextIndex >= currentState.getTurnOrder().size()) {
            nextIndex = 0;
            currentState.setRound(currentState.getRound() + 1);
        }
        
        currentState.setTurnIndex(nextIndex);
        return currentState;
    }

    // Previous Turn
    @MessageMapping("/combat/prevTurn")
    @SendTo("/topic/combat/state")
    public CombatState prevTurn() {
        if (!currentState.isInCombat()) return currentState;

        int prevIndex = currentState.getTurnIndex() - 1;
        
        if (prevIndex < 0) {
            if (currentState.getTurnOrder().size() > 0) {
                prevIndex = currentState.getTurnOrder().size() - 1;
            } else {
                prevIndex = 0;
            }
            int prevRound = currentState.getRound() - 1;
            currentState.setRound(Math.max(1, prevRound));
        }
        
        currentState.setTurnIndex(prevIndex);
        return currentState;
    }

    // players call this when they refresh the page to get the current state
    @MessageMapping("/combat/sync")
    @SendTo("/topic/combat/state")
    public CombatState syncState() {
        return currentState;
    }

    // admin calls this to end the fight
    @MessageMapping("/combat/end")
    @SendTo("/topic/combat/state")
    public CombatState endCombat() {
        currentState.setInCombat(false);
        currentState.getTurnOrder().clear();
        return currentState;
    }
}
