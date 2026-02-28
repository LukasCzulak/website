package com.example.demo.User;

import com.example.demo.User.User;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.crypto.password.PasswordEncoder;


@Service
public class UserService {

    private final Firestore firestore;
    private final PasswordEncoder passwordEncoder;

    private static final String COLLECTION_NAME = "User";

    public UserService(Firestore firestore,
                       PasswordEncoder passwordEncoder) {
        this.firestore = firestore;
        this.passwordEncoder = passwordEncoder;
    }

    public Flux<User> getAll() {
        return Flux.create(sink -> {
            try {
                firestore.collection(COLLECTION_NAME).get().get()
                        .getDocuments()
                        .forEach(doc -> sink.next(doc.toObject(User.class)));
                sink.complete();
            } catch (Exception e) {
                sink.error(e);
            }
        });
    }

    public Mono<User> save(User user) {
        return Mono.fromCallable(() -> {

            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            firestore.collection(COLLECTION_NAME)
                    .document()
                    .set(user)
                    .get();

            user.setPassword(null);
            return user;
        });
    }

    public Mono<Boolean> login(String username, String rawPassword) {
        return Mono.fromCallable(() -> {
            var snapshot = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("username", username)
                    .get()
                    .get(); // Achtung: blockiert, aber für WebFlux Mono.fromCallable okay

            if (snapshot.isEmpty()) return false;

            var user = snapshot.getDocuments().get(0).toObject(User.class);

            return passwordEncoder.matches(rawPassword, user.getPassword());
        });
    }
}
