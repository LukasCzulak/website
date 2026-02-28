package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF-Schutz für REST-API aus
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // API ist frei zugänglich
                        .anyRequest().permitAll() // optional: alles erlauben
                )
                .formLogin(login -> login.disable()) // Login-Formular deaktivieren
                .httpBasic(basic -> basic.disable()); // Browser-Login-Popup deaktivieren

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
