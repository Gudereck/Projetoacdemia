import "./Skeleton.css";

export function SkeletonLinha({ largura = "100%" }) {
  return <div className="skeleton skeleton--linha" style={{ width: largura }} />;
}

export function SkeletonTabela({ linhas = 4, colunas = 3 }) {
  return (
    <div className="skeleton-tabela">
      {Array.from({ length: linhas }).map((_, i) => (
        <div className="skeleton-tabela__linha" key={i}>
          {Array.from({ length: colunas }).map((_, j) => (
            <div className="skeleton skeleton--bloco" key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCartoes({ quantidade = 3 }) {
  return (
    <div className="skeleton-cartoes">
      {Array.from({ length: quantidade }).map((_, i) => (
        <div className="cartao skeleton-cartoes__item" key={i}>
          <div className="skeleton skeleton--linha" style={{ width: "40%", height: "1rem" }} />
          <div className="skeleton skeleton--linha" style={{ width: "70%" }} />
          <div className="skeleton skeleton--linha" style={{ width: "55%" }} />
        </div>
      ))}
    </div>
  );
}
