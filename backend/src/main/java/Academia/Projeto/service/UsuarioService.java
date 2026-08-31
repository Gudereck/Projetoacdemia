package Academia.Projeto.service;

import Academia.Projeto.entity.Aluno;
import Academia.Projeto.entity.Professor;
import Academia.Projeto.entity.Usuario;
import Academia.Projeto.entity.enums.PerfilUsuario;
import Academia.Projeto.exception.EmailDuplicadoException;
import Academia.Projeto.exception.RecursoNaoEncontradoException;
import Academia.Projeto.exception.RegraDeNegocioException;
import Academia.Projeto.repository.AlunoRepository;
import Academia.Projeto.repository.ProfessorRepository;
import Academia.Projeto.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<Usuario> listarAtivos() {
        return usuarioRepository.findByAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado: id " + id));
    }

    public Usuario criar(String nome, String email, String senha, PerfilUsuario perfil, Long alunoId, Long professorId) {
        validarEmailDisponivel(email, null);

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setPerfil(perfil);
        vincularPerfil(usuario, perfil, alunoId, professorId);
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }

    public void inativar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    public void reativar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }

    private void vincularPerfil(Usuario usuario, PerfilUsuario perfil, Long alunoId, Long professorId) {
        switch (perfil) {
            case ALUNO -> {
                if (alunoId == null) {
                    throw new RegraDeNegocioException("Usuário com perfil ALUNO precisa de um aluno vinculado");
                }
                Aluno aluno = alunoRepository.findById(alunoId)
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado: id " + alunoId));
                usuario.setAluno(aluno);
                usuario.setProfessor(null);
            }
            case PROFESSOR -> {
                if (professorId == null) {
                    throw new RegraDeNegocioException("Usuário com perfil PROFESSOR precisa de um professor vinculado");
                }
                Professor professor = professorRepository.findById(professorId)
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado: id " + professorId));
                usuario.setProfessor(professor);
                usuario.setAluno(null);
            }
            case ADMIN, ATENDENTE -> {
                usuario.setAluno(null);
                usuario.setProfessor(null);
            }
        }
    }

    private void validarEmailDisponivel(String email, Long idAtual) {
        usuarioRepository.findByEmail(email).ifPresent(existente -> {
            if (!existente.getId().equals(idAtual)) {
                throw new EmailDuplicadoException("E-mail já cadastrado: " + email);
            }
        });
    }
}
