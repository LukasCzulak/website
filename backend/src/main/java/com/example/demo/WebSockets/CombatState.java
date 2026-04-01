package com.example.demo.WebSockets;

import java.util.ArrayList;
import java.util.List;

public class CombatState {
    private boolean inCombat = false;
    private int round = 0;
    private int turnIndex = 0;
    private List<String> turnOrder = new ArrayList<>(); // Will hold Character IDs

    public boolean isInCombat() { return inCombat; }
    public void setInCombat(boolean inCombat) { this.inCombat = inCombat; }

    public int getRound() { return round; }
    public void setRound(int round) { this.round = round; }

    public int getTurnIndex() { return turnIndex; }
    public void setTurnIndex(int turnIndex) { this.turnIndex = turnIndex; }

    public List<String> getTurnOrder() { return turnOrder; }
    public void setTurnOrder(List<String> turnOrder) { this.turnOrder = turnOrder; }
}
