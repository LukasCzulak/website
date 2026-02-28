package com.example.demo.User;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class User {
    @DocumentId
    private String id;
    private String username;
    private String password;
}