export function FaithfulnessPipeline() {
  const nodes = [
    ['01', 'User query'],
    ['02', 'Retrieve + rerank'],
    ['03', 'Context assembly'],
    ['04', 'Generate + cite'],
    ['05', 'Audited answer'],
  ]
  return (
    <div className="faithfulness-pipeline" aria-label="RAG faithfulness pipeline">
      <div className="faithfulness-pipeline-label">RAG PIPELINE · WHERE FAITHFULNESS CAN FAIL</div>
      <div className="faithfulness-pipeline-track">
        {nodes.map(([n, label], i) => (
          <div className={`faithfulness-pipeline-node node-${i}`} key={n}>
            <span>{n}</span><strong>{label}</strong>
            {i < nodes.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        ))}
      </div>
      <div className="faithfulness-pipeline-notes">
        <span><b>Retrieval failure</b> · wrong evidence enters context</span>
        <span><b>Generation failure</b> · right evidence, unsupported answer</span>
      </div>
    </div>
  )
}
