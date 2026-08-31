package Academia.Projeto.security;

import Academia.Projeto.entity.Usuario;
import Academia.Projeto.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class LoginAttemptListener {

    private static final int MAX_TENTATIVAS = 5;
    private static final long BLOQUEIO_MINUTOS = 15;

    private final UsuarioRepository usuarioRepository;

    @EventListener
    @Transactional
    public void aoFalhar(AuthenticationFailureBadCredentialsEvent evento) {
        String email = evento.getAuthentication().getName();
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            int tentativas = usuario.getTentativasFalhas() + 1;
            usuario.setTentativasFalhas(tentativas);
            if (tentativas >= MAX_TENTATIVAS) {
                usuario.setBloqueadoAte(LocalDateTime.now().plusMinutes(BLOQUEIO_MINUTOS));
            }
            usuarioRepository.save(usuario);
        });
    }

    @EventListener
    @Transactional
    public void aoAutenticar(AuthenticationSuccessEvent evento) {
        String email = evento.getAuthentication().getName();
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            usuario.setTentativasFalhas(0);
            usuario.setBloqueadoAte(null);
            usuario.setUltimoAcessoEm(LocalDateTime.now());
            usuarioRepository.save(usuario);
        });
    }
}
