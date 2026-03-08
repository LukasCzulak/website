package com.example.demo.Character;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping
    public Flux<Character> getAllCharacters() {
        return characterService.getAllCharacters();
    }

    @PostMapping
    public Mono<Character> createCharacter(@RequestBody Character character) {
        return characterService.saveCharacter(character);
    }

    @PutMapping("/taken")
    public ResponseEntity<?> updateTaken(@RequestBody Map<String, Object> data) {
        characterService.updateTaken(data);
        return ResponseEntity.ok().build();
    }
}
