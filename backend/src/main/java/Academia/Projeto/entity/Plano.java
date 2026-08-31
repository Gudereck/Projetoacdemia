package Academia.Projeto.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "plano")
public class Plano extends SoftDeletableEntity {

    @Column(nullable = false)
    private String nome;

    @Column(name = "duracao_meses", nullable = false)
    private Integer duracaoMeses;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(columnDefinition = "text")
    private String descricao;
}
