package Academia.Projeto.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleNaoEncontrado(RecursoNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(corpoErro(HttpStatus.NOT_FOUND, ex.getMessage()));
    }

    @ExceptionHandler(CpfDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleCpfDuplicado(CpfDuplicadoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(corpoErro(HttpStatus.CONFLICT, ex.getMessage()));
    }

    @ExceptionHandler(EmailDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleEmailDuplicado(EmailDuplicadoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(corpoErro(HttpStatus.CONFLICT, ex.getMessage()));
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<Map<String, Object>> handleRegraDeNegocio(RegraDeNegocioException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corpoErro(HttpStatus.BAD_REQUEST, ex.getMessage()));
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<Map<String, Object>> handleContaBloqueada(LockedException ex) {
        return ResponseEntity.status(HttpStatus.LOCKED).body(corpoErro(HttpStatus.LOCKED,
                "Conta temporariamente bloqueada por excesso de tentativas de login. Tente novamente mais tarde."));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, Object>> handleContaInativa(DisabledException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(corpoErro(HttpStatus.FORBIDDEN, "Usuário inativo"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAcessoNegado(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(corpoErro(HttpStatus.FORBIDDEN, "Você não tem permissão para acessar este recurso"));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAutenticacao(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(corpoErro(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(corpoErro(HttpStatus.BAD_REQUEST, "Corpo da requisição inválido ou malformado"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            campos.put(erro.getField(), erro.getDefaultMessage());
        }
        Map<String, Object> corpo = corpoErro(HttpStatus.BAD_REQUEST, "Dados inválidos");
        corpo.put("campos", campos);
        return ResponseEntity.badRequest().body(corpo);
    }

    private Map<String, Object> corpoErro(HttpStatus status, String mensagem) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", status.value());
        corpo.put("erro", status.getReasonPhrase());
        corpo.put("mensagem", mensagem);
        return corpo;
    }
}
