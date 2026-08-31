package Academia.Projeto.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                       @Value("${app.jwt.expiration-ms}") long expiracaoMs) {
        this.chave = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiracaoMs = expiracaoMs;
    }

    public String gerarToken(UserDetails userDetails) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expiracaoMs);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(chave)
                .compact();
    }

    public boolean tokenValido(String token, UserDetails userDetails) {
        try {
            String email = extrairEmail(token);
            return email.equals(userDetails.getUsername()) && !tokenExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    private boolean tokenExpirado(String token) {
        return extrairClaims(token).getExpiration().before(new Date());
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser().verifyWith(chave).build().parseSignedClaims(token).getPayload();
    }
}
