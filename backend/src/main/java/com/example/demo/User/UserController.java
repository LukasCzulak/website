package com.example.demo.User;

import com.example.demo.User.User;
import com.example.demo.User.UserService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public Flux<User> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Mono<Void> create(@RequestBody User user) {
        return service.save(user).then();
    }
}
