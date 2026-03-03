package com.example.demo.Character;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
}
