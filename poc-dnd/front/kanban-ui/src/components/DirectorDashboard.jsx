export default function DirectorDashboard({ units, isLoading }) {
  const totalScore = units.reduce((sum, unit) => sum + (unit.pontuacao || 0), 0);

  return (
    <>
      <header className="app__header">
        <div>
          <h1>Painel de Diretoria</h1>
          <p>Acompanhe as unidades do clube e suas pontuacoes.</p>
        </div>
        <div className="summary-card">
          <strong>{totalScore}</strong>
          <span>pontos</span>
        </div>
      </header>

      {isLoading ? (
        <div className="app__status">Carregando unidades...</div>
      ) : units.length ? (
        <section className="units-grid">
          {units.map((unit) => (
            <article className="unit-card" key={unit.id}>
              <div>
                <span className="unit-card__eyebrow">Unidade</span>
                <h2>{unit.nome}</h2>
              </div>
              <strong>{unit.pontuacao || 0}</strong>
              <span>pontos acumulados</span>
            </article>
          ))}
        </section>
      ) : (
        <div className="app__status">Nenhuma unidade encontrada para este diretor.</div>
      )}
    </>
  );
}
