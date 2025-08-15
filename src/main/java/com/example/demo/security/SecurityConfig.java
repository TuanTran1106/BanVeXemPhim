package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;
    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - không cần authentication
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll()
                        .requestMatchers("/api/movies/**").permitAll()
                        .requestMatchers("/api/cinemas/**").permitAll()
                        .requestMatchers("/api/showtimes/**").permitAll()
                        .requestMatchers("/api/screening-rooms/**").permitAll()
                        .requestMatchers("/api/seats/**").permitAll()

                        // Cho phép xem vé đã bán (đếm ghế trống) mà không cần đăng nhập
                        .requestMatchers(HttpMethod.GET, "/api/tickets").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets/**").permitAll()
                        
                        // Admin endpoints - cần role ADMIN
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/cinemas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/showtimes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/screening-rooms/**").hasRole("ADMIN")
                        
                        // User endpoints - cần authentication (trừ GET đã permit ở trên)
                        .requestMatchers("/api/users/profile/**").authenticated()
                        
                        // Default - cho phép tất cả
                        .anyRequest().permitAll()
                );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and().build();
    }
}
