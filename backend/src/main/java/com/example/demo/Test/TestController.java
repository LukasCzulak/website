package com.example.demo.Test;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    private final TestService service;

    public TestController(TestService service) {
        this.service = service;
    }

    @GetMapping
    public Flux<Test> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Mono<Test> create(@RequestBody Test test) {
        // ID automatisch generieren, falls leer
        if(test.getId() == null) {
            test.setId(null); // Firestore erzeugt automatisch eine
        }
        return service.save(test);
    }
}
