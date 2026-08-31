package Academia.Projeto.controller;

import Academia.Projeto.dto.LoginRequest;
import Academia.Projeto.dto.LoginResponse;
import Academia.Projeto.dto.MeResponse;
import Academia.Projeto.security.JwtService;
import Academia.Projeto.security.UsuarioPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return LoginResponse.of(jwtService.gerarToken(userDetails));
    }

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return MeResponse.from(principal.getUsuario());
    }
}
