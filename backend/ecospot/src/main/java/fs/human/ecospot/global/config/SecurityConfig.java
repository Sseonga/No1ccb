package fs.human.ecospot.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable() // ✅ JSON POST 위해 반드시 disable
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",                   // 루트
                                "/index.html",         // React 메인 진입점
                                "/favicon.ico",        // 파비콘
                                "/static/**",          // 정적 리소스 (js/css 등)
                                "/assets/**"           // 혹시 public/assets 폴더 쓰는 경우
                        ).permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated()  // 나머지 요청은 인증 필요 (아니면 .permitAll() 해도 무방)
                );

        return http.build();
    }
}


