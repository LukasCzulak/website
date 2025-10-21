package com.example.demo.Test;

import com.google.cloud.spring.data.firestore.FirestoreReactiveRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends FirestoreReactiveRepository<Test> {
}
