package Academia.Projeto.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "treino_exercicio")
public class TreinoExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "treino_id", nullable = false)
    private Treino treino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipamento_id")
    private Equipamento equipamento;

    @Column(name = "nome_exercicio", nullable = false)
    private String nomeExercicio;

    @Column(nullable = false)
    private Integer series;

    @Column(nullable = false)
    private Integer repeticoes;

    @Column(name = "carga_kg", precision = 5, scale = 2)
    private BigDecimal cargaKg;

    @Column(name = "descanso_segundos")
    private Integer descansoSegundos;

    @Column(nullable = false)
    private Integer ordem;
}
