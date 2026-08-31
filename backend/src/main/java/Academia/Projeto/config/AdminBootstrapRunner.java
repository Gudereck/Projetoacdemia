package Academia.Projeto.config;

import Academia.Projeto.entity.Usuario;
import Academia.Projeto.entity.enums.PerfilUsuario;
import Academia.Projeto.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    @Value("${app.admin.email}")
    private String emailAdminPadrao;

    @Value("${app.admin.password}")
    private String senhaAdminPadrao;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setNome("Administrador");
        admin.setEmail(emailAdminPadrao);
        admin.setSenhaHash(passwordEncoder.encode(senhaAdminPadrao));
        admin.setPerfil(PerfilUsuario.ADMIN);
        admin.setAtivo(true);
        usuarioRepository.save(admin);

        log.info("Usuário admin inicial criado: {} (ALTERE a senha antes de produção)", emailAdminPadrao);
    }
}
