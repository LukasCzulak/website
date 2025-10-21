package com.example.demo.Test;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Test {
    @DocumentId
    private String id;
    private String testdata;
}
