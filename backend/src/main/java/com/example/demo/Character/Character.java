package com.example.demo.Character;

import java.util.Map;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Character {
    
    @DocumentId
    private String id;
    
    private String name;
    private String title;
    private String icon; 
    private String description;
    
    private String playstyle;
    private String perfect;
    
    private Integer attack_damage;
    private Float attack_speed;
    private Integer hitpoints;
    private Map<String, Object> abilities;
}
