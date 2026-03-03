package com.example.demo.Character;

import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
@Service
public class CharacterService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "Characters";

    public CharacterService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Flux<Character> getAllCharacters() {
        return Flux.create(sink -> {
            try {
                firestore.collection(COLLECTION_NAME).get().get()
                        .getDocuments()
                        .forEach(doc -> sink.next(doc.toObject(Character.class)));
                sink.complete();
            } catch (Exception e) {
                sink.error(e);
            }
        });
    }

    public Mono<Character> saveCharacter(Character character) {
        return Mono.fromCallable(() -> {
            firestore.collection(COLLECTION_NAME)
                    .document(character.getId())
                    .set(character)
                    .get();
            return character;
        });
    }
}
