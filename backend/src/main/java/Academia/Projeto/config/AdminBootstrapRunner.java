package Academia.Projeto.config;

import Academia.Projeto.entity.Usuario;
import Academia.Projeto.entity.enums.PerfilUsuario;
import Academia.Projeto.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private static final String EMAIL_ADMIN_PADRAO = "admin@academia.local";
    private static final String SENHA_ADMIN_PADRAO = "admin123";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setNome("Administrador");
        admin.setEmail(EMAIL_ADMIN_PADRAO);
        admin.setSenhaHash(passwordEncoder.encode(SENHA_ADMIN_PADRAO));
        admin.setPerfil(PerfilUsuario.ADMIN);
        admin.setAtivo(true);
        usuarioRepository.save(admin);

        log.info("Usuário admin inicial criado: {} / senha: {} (ALTERE antes de produção)",
                EMAIL_ADMIN_PADRAO, SENHA_ADMIN_PADRAO);
    }
}
