package Academia.Projeto.dto;

import Academia.Projeto.entity.TreinoExercicio;

import java.math.BigDecimal;

public record TreinoExercicioResponse(
        Long id,
        Long equipamentoId,
        String equipamentoNome,
        String nomeExercicio,
        Integer series,
        Integer repeticoes,
        BigDecimal cargaKg,
        Integer descansoSegundos,
        Integer ordem
) {
    public static TreinoExercicioResponse from(TreinoExercicio exercicio) {
        return new TreinoExercicioResponse(
                exercicio.getId(),
                exercicio.getEquipamento() != null ? exercicio.getEquipamento().getId() : null,
                exercicio.getEquipamento() != null ? exercicio.getEquipamento().getNome() : null,
                exercicio.getNomeExercicio(),
                exercicio.getSeries(),
                exercicio.getRepeticoes(),
                exercicio.getCargaKg(),
                exercicio.getDescansoSegundos(),
                exercicio.getOrdem()
        );
    }
}
