package com.example.demo.User;

import com.example.demo.User.User;
import com.google.cloud.spring.data.firestore.FirestoreReactiveRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends FirestoreReactiveRepository<User> {
}
