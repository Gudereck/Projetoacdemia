package Academia.Projeto.entity;

import Academia.Projeto.entity.enums.StatusEquipamento;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "equipamento")
public class Equipamento extends SoftDeletableEntity {

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusEquipamento status;

    @Column(name = "data_aquisicao", nullable = false)
    private LocalDate dataAquisicao;
}
