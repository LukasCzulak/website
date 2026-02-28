package com.example.demo.User;

import com.example.demo.User.User;
import com.example.demo.User.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Mono<Map<String, String>> login(@RequestBody LoginRequest request) {
        return userService.login(request.getUsername(), request.getPassword())
                .map(success -> {
                    Map<String, String> res = new HashMap<>();
                    if (success) {
                        res.put("status", "ok");
                        res.put("message", "Login erfolgreich");
                    } else {
                        res.put("status", "error");
                        res.put("message", "Falscher Benutzername oder Passwort");
                    }
                    return res;
                });
    }
}
