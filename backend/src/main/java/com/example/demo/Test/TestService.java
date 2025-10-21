package com.example.demo.Test;

import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class TestService {
    private final Firestore firestore;
    private static final String COLLECTION_NAME = "Test"; // Ihr echter Collection-Name

    public TestService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Flux<Test> getAll() {
        return Flux.create(sink -> {
            try {
                firestore.collection(COLLECTION_NAME).get().get()
                        .getDocuments()
                        .forEach(doc -> sink.next(doc.toObject(Test.class)));
                sink.complete();
            } catch (Exception e) {
                sink.error(e);
            }
        });
    }

    public Mono<Test> save(Test test) {
        return Mono.fromCallable(() -> {
            firestore.collection(COLLECTION_NAME).document(test.getId()).set(test).get();
            return test;
        });
    }
}
