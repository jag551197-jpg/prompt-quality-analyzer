const LANGS={en:{flag:"🇺🇸",label:"English",locale:"en-US"},pt:{flag:"🇧🇷",label:"Português (Brasil)",locale:"pt-BR"},fr:{flag:"🇫🇷",label:"Français",locale:"fr-FR"}};const CATALOG={pt:{"EVIDENCE STRENGTH":"FORÇA DA EVIDÊNCIA","Structural evidence coverage":"Cobertura estrutural das evidências","Evidence strength":"Força da evidência","PQA Community — AI Instruction Reliability":"PQA Community — Confiabilidade de Instruções para IA","PQA — AI Instruction Reliability":"PQA — Confiabilidade de Instruções para IA","AI Instruction Reliability":"Confiabilidade de Instruções para IA","Analyze":"Analisar","History":"Histórico","Benchmark":"Benchmark","Diagnostics":"Diagnóstico","Engine ready":"Mecanismo pronto","DEVELOPER RELIABILITY CONTROL":"CONTROLE DE CONFIABILIDADE PARA DESENVOLVEDORES","Analyze before AI executes.":"Analise antes que a IA execute.","Test Gemini":"Testar Gemini","ENGINE":"MECANISMO","BENCHMARK":"BENCHMARK","RISK MODEL":"MODELO DE RISCO","Evidence-tiered v3":"Baseado em níveis de evidência v3","MODE":"MODO","Prompt-first · repo optional":"Prompt como entrada principal · repositório opcional","Prompt + docs · repo optional":"Prompt + documentos · repositório opcional","QUALITY SCORE":"ÍNDICE DE QUALIDADE","No analysis yet":"Nenhuma análise realizada","HALLUCINATION RISK":"RISCO DE ALUCINAÇÃO","Awaiting evaluation":"Aguardando avaliação","CONFIDENCE":"CONFIANÇA","Score confidence":"Confiança da avaliação","LOCAL TREND":"TENDÊNCIA LOCAL","Recent browser analyses":"Análises recentes neste dispositivo","ESTIMATED EFFICIENCY WALLET":"CARTEIRA DE EFICIÊNCIA ESTIMADA","Value unlocked by better instructions":"Valor potencial gerado por instruções melhores","ESTIMATED TOKENS SAVED":"TOKENS ECONOMIZADOS — ESTIMATIVA","AI COST AVOIDED":"CUSTO DE IA EVITADO","estimated":"estimado","RETRIES AVOIDED":"REPETIÇÕES EVITADAS","expected corrective cycles":"ciclos corretivos esperados","MODELED":"MODELADO","not measured provider billing":"não corresponde à cobrança medida do provedor","All time":"Todo o período","This month":"Este mês","Today":"Hoje","Methodology":"Metodologia","Reset wallet":"Zerar carteira","Savings are estimates based on instruction quality, expected retries, task complexity and a configurable token-price profile. They are not guaranteed billing reductions.":"As economias são estimativas baseadas na qualidade da instrução, nas repetições esperadas, na complexidade da tarefa e em um perfil configurável de preço por token. Não representam redução garantida na cobrança.","RELIABILITY TREND":"TENDÊNCIA DE CONFIABILIDADE","Recent prompt quality":"Qualidade recente das instruções","Run analyses to build a local reliability trend. No synthetic data is shown.":"Execute análises para construir a tendência local de confiabilidade. Nenhum dado sintético é exibido.","INPUT":"ENTRADA","Developer instruction":"Instrução para IA","Prompt-only by default":"Somente prompt por padrão","Use case":"Caso de uso","General":"Geral","RAG / Document Q&A":"RAG / Perguntas e respostas sobre documentos","Customer Support":"Atendimento ao cliente","Coding / Software Development":"Programação / Desenvolvimento de software","Research":"Pesquisa","Data Analysis":"Análise de dados","Agent / Tool Use":"Agentes / Uso de ferramentas","Structured Extraction":"Extração estruturada","Prompt":"Prompt","Optional evidence / context":"Evidências / contexto opcionais","Requires current / time-sensitive facts":"Requer informações atuais / sensíveis ao tempo","Analyze instruction":"Analisar instrução","Cancel":"Cancelar","Prompt/context required for refresh recovery is stored locally in this browser. The application does not persist it on the server. If Gemini is enabled, evaluation content is sent to the configured Gemini endpoint.":"O prompt e o contexto necessários para recuperação após uma atualização da página são armazenados localmente neste navegador. A aplicação não os persiste no servidor. Se o Gemini estiver habilitado, o conteúdo da avaliação será enviado ao endpoint Gemini configurado.","RELIABILITY ASSESSMENT":"AVALIAÇÃO DE CONFIABILIDADE","Instruction quality":"Qualidade da instrução","NOT EVALUATED":"NÃO AVALIADO","READY":"PRONTO","Hallucination risk":"Risco de alucinação","Score range":"Faixa de pontuação","Confidence":"Confiança","Evaluation mode":"Modo de avaliação","Reason codes":"Códigos de diagnóstico","machine-readable":"legível por máquina","No reason codes":"Nenhum código de diagnóstico","Evidence & controls":"Evidências e controles","positive safeguards":"salvaguardas positivas","No evidence controls detected yet.":"Nenhum controle de evidência foi identificado até o momento.","Findings":"Constatações","reliability gaps":"lacunas de confiabilidade","Analyze an instruction to see findings.":"Analise uma instrução para visualizar as constatações.","Recommendations":"Recomendações","next actions":"próximas ações","Recommendations will appear here.":"As recomendações serão exibidas aqui.","REMEDIATION":"CORREÇÃO","Recommended instruction":"Instrução recomendada","Re-analyze":"Analisar novamente","EXECUTION":"EXECUÇÃO","Analysis lifecycle":"Ciclo da análise","Ready":"Pronto","Elapsed":"Tempo decorrido","ETA":"Previsão","Request":"Solicitação","State":"Estado","Attempts":"Tentativas","AUDITABILITY":"AUDITABILIDADE","Evaluation provenance":"Proveniência da avaliação","TRACEABLE":"RASTREÁVEL","PQA engine":"Mecanismo PQA","Rubric":"Rubrica","Risk model":"Modelo de risco","Scoring profile":"Perfil de pontuação","Judge":"Avaliador","Judge latency":"Latência do avaliador","Request ID":"ID da solicitação","Updated":"Atualizado","RISK EVIDENCE":"EVIDÊNCIAS DE RISCO","Detected indicators":"Indicadores detectados","No risk evidence available yet.":"Nenhuma evidência de risco disponível até o momento.","DIAGNOSTICS":"DIAGNÓSTICO","Live execution log":"Registro de execução em tempo real","Server logs":"Registros do servidor","Clear":"Limpar","Ready.":"Pronto.","JUDGE EVIDENCE":"EVIDÊNCIAS DO AVALIADOR","Gemini structured response":"Resposta estruturada do Gemini","Copy JSON":"Copiar JSON","No Gemini response yet.":"Nenhuma resposta do Gemini até o momento.","LOCAL AUDIT LEDGER":"REGISTRO LOCAL DE AUDITORIA","Browser transaction history":"Histórico de transações neste navegador","Clear history":"Limpar histórico","ACCOUNT & PLAN":"CONTA E PLANO","Hosted AI quota applies":"Sujeito à cota de IA hospedada","Refresh plan":"Atualizar plano","PQA LEARN":"PQA LEARN","Learn from your own prompt weaknesses":"Aprenda a partir dos pontos fracos das suas próprias instruções","Learn tier+":"Plano Learn ou superior","Sign in with a Learn/Pro/Team/Enterprise entitlement to load lessons.":"Entre com uma autorização Learn, Pro, Team ou Enterprise para carregar as lições.","AI EFFICIENCY VALUE":"VALOR DE EFICIÊNCIA DE IA","Estimated savings and engineering productivity":"Economia estimada e produtividade de engenharia","AUDITABLE MODEL":"MODELO AUDITÁVEL","Export JSON":"Exportar JSON","ESTIMATED TOTAL VALUE":"VALOR TOTAL ESTIMADO","TOKENS AVOIDED":"TOKENS EVITADOS","DIRECT AI COST":"CUSTO DIRETO DE IA","estimated avoidance":"economia estimada","corrective cycles":"ciclos corretivos","REWORK HOURS":"HORAS DE RETRABALHO","modeled":"modelado","PRODUCTIVITY VALUE":"VALOR DE PRODUTIVIDADE","configurable assumption":"premissa configurável","7 days":"7 dias","30 days":"30 dias","Savings assumptions":"Premissas de economia","Reset visible ledger":"Zerar registro visível","Input $ / 1M tokens":"Entrada US$ / 1 mi de tokens","Output $ / 1M tokens":"Saída US$ / 1 mi de tokens","Correction cycle (minutes)":"Ciclo de correção (minutos)","Developer value ($/hour)":"Valor do desenvolvedor (US$/hora)","Save assumptions":"Salvar premissas","Classification: ESTIMATED. Direct AI cost uses the selected pricing profile. Productivity value uses configurable rework assumptions. Use observed provider usage when available for financial reporting.":"Classificação: ESTIMADO. O custo direto de IA usa o perfil de preços selecionado. O valor de produtividade usa premissas configuráveis de retrabalho. Para relatórios financeiros, utilize o consumo observado do provedor quando disponível.","Project documentation":"Documentação do projeto","optional · Markdown / README / text":"opcional · Markdown / README / texto","Drop .md / README files here or click to add":"Arraste arquivos .md / README aqui ou clique para adicionar","No project documents selected.":"Nenhum documento de projeto selecionado.","Ephemeral: content scrubbed from local ledger after completion":"Efêmero: o conteúdo é removido do registro local após a conclusão","Project-context evidence":"Evidências do contexto do projeto","Upload Markdown/README files to enable evidence-backed project-context analysis.":"Envie arquivos Markdown/README para habilitar a análise do contexto do projeto fundamentada em evidências.","RELIABILITY ENGINEERING — OWNER ONLY":"ENGENHARIA DE CONFIABILIDADE — SOMENTE PROPRIETÁRIO","Platform control room":"Central de controle da plataforma","RESTRICTED":"RESTRITO","USER JOURNEYS":"JORNADAS DE USUÁRIO","AI CALLS":"CHAMADAS DE IA","TRAFFIC":"TRÁFEGO","SECURITY":"SEGURANÇA","Traffic geography":"Geografia do tráfego","Map activates after privacy-reviewed telemetry is configured.":"O mapa será ativado após a configuração de telemetria revisada sob a ótica de privacidade.","AI configuration":"Configuração de IA","Loading…":"Carregando…","No telemetry loaded.":"Nenhuma telemetria carregada.","PQA home":"Página inicial do PQA","Language":"Idioma","Reliability overview":"Visão geral de confiabilidade","Recent prompt quality trend":"Tendência recente da qualidade das instruções","Example: Look at this API and fix why it is slow. Don't break anything. Give me the files I need to change.":"Exemplo: analise esta API e corrija a causa da lentidão. Preserve o comportamento existente e informe quais arquivos precisam ser alterados.","Selected logs, requirements, code excerpt, document text, acceptance criteria...":"Logs selecionados, requisitos, trecho de código, texto de documento, critérios de aceitação...","Selected logs, requirements, code excerpt, acceptance criteria...":"Logs selecionados, requisitos, trecho de código, critérios de aceitação...","The recommended prompt will appear here when Gemini is configured.":"O prompt recomendado será exibido aqui quando o Gemini estiver configurado.","Paste a prompt first.":"Cole um prompt antes de analisar.","Queued…":"Na fila…","Running asynchronously…":"Executando de forma assíncrona…","Select a transaction first.":"Selecione uma transação primeiro.","Administrator API token for server logs. The token is used for this request only and is not stored by the app.":"Token de API do administrador para consultar os registros do servidor. O token será usado somente nesta solicitação e não será armazenado pela aplicação.","Reset the visible Efficiency Wallet? This does not change prior analysis history.":"Zerar a Carteira de Eficiência visível? Essa ação não altera o histórico de análises.","Clear browser transaction history?":"Limpar o histórico de transações deste navegador?","History cleared.":"Histórico limpo.","Copied":"Copiado","Testing…":"Testando…","Server Logs":"Registros do servidor","Estimated tokens = prompt/output token model × expected retry reduction. Token count uses ~4 characters/token. Retry probability is modeled from PQA quality score and risk level. Dollar savings use the configured planning price profile and are not provider billing records.":"Tokens estimados = modelo de tokens de entrada/saída × redução esperada de repetições. A contagem usa aproximadamente 4 caracteres por token. A probabilidade de repetição é modelada a partir do índice de qualidade e do nível de risco do PQA. A economia em dólares usa o perfil de preços configurado para planejamento e não corresponde a registros de cobrança do provedor.","Savings assumptions updated. Existing ledger events retain the assumptions recorded when they were created.":"Premissas de economia atualizadas. Os eventos já registrados preservam as premissas vigentes quando foram criados.","Reset this device savings ledger? Analysis history remains unchanged.":"Zerar o registro de economia deste dispositivo? O histórico de análises permanecerá inalterado.","Plan service unavailable":"Serviço de planos indisponível","Hosted AI analyses/day":"análises de IA hospedadas/dia","AI analyses/month":"análises de IA/mês","HALLUCINATION EXPLAINER":"EXPLICADOR DE ALUCINAÇÃO","Why this prompt may hallucinate":"Por que este prompt pode gerar alucinações","Risk mechanics, not a probability claim":"Mecânica de risco, não uma afirmação de probabilidade","NOT CALIBRATED":"NÃO CALIBRADO","PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate.":"O PQA apresenta um índice de risco no nível do prompt, não uma probabilidade calibrada de que a resposta do modelo contenha alucinação.","ANSWERABILITY":"RESPONDIBILIDADE","Awaiting analysis":"Aguardando análise","GROUNDING REQUIREMENT":"NECESSIDADE DE FUNDAMENTAÇÃO","HALLUCINATION PRESSURE":"PRESSÃO PARA ALUCINAÇÃO","ABSTENTION SAFETY":"SEGURANÇA DE ABSTENÇÃO","CURRENT-FACT DEPENDENCY":"DEPENDÊNCIA DE FATOS ATUAIS","ORIGINAL":"ORIGINAL","RECOMMENDED PROMPT":"PROMPT RECOMENDADO","Main risk drivers":"Principais fatores de risco","point contribution":"contribuição em pontos","No analysis yet.":"Nenhuma análise ainda.","Risk categories":"Categorias de risco","0–100 index":"índice 0–100","What would reduce risk":"O que reduziria o risco","projected change":"mudança projetada","Execution conditions":"Condições de execução","scenario sensitivity":"sensibilidade por cenário","Risk index and projected reductions are engineering decision-support signals, not empirical probabilities or guarantees of model behavior.":"O índice de risco e as reduções projetadas são sinais de engenharia para apoio à decisão, não probabilidades empíricas nem garantias do comportamento do modelo."},fr:{"PQA Community — AI Instruction Reliability":"PQA Community — Fiabilité des instructions IA","PQA — AI Instruction Reliability":"PQA — Fiabilité des instructions IA","AI Instruction Reliability":"Fiabilité des instructions IA","Analyze":"Analyser","History":"Historique","Benchmark":"Benchmark","Diagnostics":"Diagnostic","Engine ready":"Moteur opérationnel","DEVELOPER RELIABILITY CONTROL":"CONTRÔLE DE FIABILITÉ POUR DÉVELOPPEURS","Analyze before AI executes.":"Analysez avant que l’IA n’exécute.","Test Gemini":"Tester Gemini","ENGINE":"MOTEUR","BENCHMARK":"BENCHMARK","RISK MODEL":"MODÈLE DE RISQUE","Evidence-tiered v3":"Fondé sur des niveaux de preuve v3","MODE":"MODO","Prompt-first · repo optional":"Prompt en priorité · dépôt facultatif","Prompt + docs · repo optional":"Prompt + documents · dépôt facultatif","QUALITY SCORE":"SCORE DE QUALITÉ","No analysis yet":"Aucune analyse effectuée","HALLUCINATION RISK":"RISQUE D’HALLUCINATION","Awaiting evaluation":"En attente d’évaluation","CONFIDENCE":"CONFIANCE","Score confidence":"Confiance de l’évaluation","LOCAL TREND":"TENDANCE LOCALE","Recent browser analyses":"Analyses récentes sur cet appareil","ESTIMATED EFFICIENCY WALLET":"PORTEFEUILLE D’EFFICACITÉ ESTIMÉE","Value unlocked by better instructions":"Valeur potentielle créée par de meilleures instructions","ESTIMATED TOKENS SAVED":"JETONS ÉCONOMISÉS — ESTIMATION","AI COST AVOIDED":"COÛT IA ÉVITÉ","estimated":"estimé","RETRIES AVOIDED":"NOUVELLES TENTATIVES ÉVITÉES","expected corrective cycles":"cycles correctifs attendus","MODELED":"MODÉLISÉ","not measured provider billing":"ne correspond pas à la facturation mesurée du fournisseur","All time":"Toute la période","This month":"Ce mois-ci","Today":"Aujourd’hui","Methodology":"Méthodologie","Reset wallet":"Réinitialiser le portefeuille","Savings are estimates based on instruction quality, expected retries, task complexity and a configurable token-price profile. They are not guaranteed billing reductions.":"Les économies sont des estimations fondées sur la qualité de l’instruction, les nouvelles tentatives attendues, la complexité de la tâche et un profil tarifaire configurable par jeton. Elles ne garantissent aucune réduction de facturation.","RELIABILITY TREND":"TENDANCE DE FIABILITÉ","Recent prompt quality":"Qualité récente des instructions","Run analyses to build a local reliability trend. No synthetic data is shown.":"Exécutez des analyses pour construire une tendance locale de fiabilité. Aucune donnée synthétique n’est affichée.","INPUT":"ENTRÉE","Developer instruction":"Instruction destinée à l’IA","Prompt-only by default":"Prompt uniquement par défaut","Use case":"Cas d’usage","General":"Général","RAG / Document Q&A":"RAG / Questions-réponses sur documents","Customer Support":"Support client","Coding / Software Development":"Programmation / Développement logiciel","Research":"Recherche","Data Analysis":"Analyse de données","Agent / Tool Use":"Agents / Utilisation d’outils","Structured Extraction":"Extraction structurée","Prompt":"Prompt","Optional evidence / context":"Éléments probants / contexte facultatifs","Requires current / time-sensitive facts":"Nécessite des informations actuelles / sensibles au temps","Analyze instruction":"Analyser l’instruction","Cancel":"Annuler","Prompt/context required for refresh recovery is stored locally in this browser. The application does not persist it on the server. If Gemini is enabled, evaluation content is sent to the configured Gemini endpoint.":"Le prompt et le contexte nécessaires à la reprise après actualisation sont stockés localement dans ce navigateur. L’application ne les conserve pas sur le serveur. Si Gemini est activé, le contenu de l’évaluation est envoyé au point de terminaison Gemini configuré.","RELIABILITY ASSESSMENT":"ÉVALUATION DE FIABILITÉ","Instruction quality":"Qualité de l’instruction","NOT EVALUATED":"NON ÉVALUÉ","READY":"PRÊT","Hallucination risk":"Risque d’hallucination","Score range":"Plage de score","Confidence":"Confiance","Evaluation mode":"Mode d’évaluation","Reason codes":"Codes de diagnostic","machine-readable":"lisible par machine","No reason codes":"Aucun code de diagnostic","Evidence & controls":"Éléments probants et contrôles","positive safeguards":"mesures de protection","No evidence controls detected yet.":"Aucun contrôle d’éléments probants n’a encore été détecté.","Findings":"Constats","reliability gaps":"écarts de fiabilité","Analyze an instruction to see findings.":"Analysez une instruction pour afficher les constats.","Recommendations":"Recommandations","next actions":"prochaines actions","Recommendations will appear here.":"Les recommandations apparaîtront ici.","REMEDIATION":"CORRECTION","Recommended instruction":"Instruction recommandée","Re-analyze":"Analyser à nouveau","EXECUTION":"EXÉCUTION","Analysis lifecycle":"Cycle de l’analyse","Ready":"Prêt","Elapsed":"Temps écoulé","ETA":"Estimation","Request":"Requête","State":"État","Attempts":"Tentatives","AUDITABILITY":"AUDITABILITÉ","Evaluation provenance":"Provenance de l’évaluation","TRACEABLE":"TRAÇABLE","PQA engine":"Moteur PQA","Rubric":"Grille d’évaluation","Risk model":"Modèle de risque","Scoring profile":"Profil de notation","Judge":"Évaluateur","Judge latency":"Latence de l’évaluateur","Request ID":"ID de requête","Updated":"Mis à jour","RISK EVIDENCE":"ÉLÉMENTS DE RISQUE","Detected indicators":"Indicateurs détectés","No risk evidence available yet.":"Aucun élément de risque disponible pour le moment.","DIAGNOSTICS":"DIAGNOSTIC","Live execution log":"Journal d’exécution en direct","Server logs":"Journaux serveur","Clear":"Effacer","Ready.":"Prêt.","JUDGE EVIDENCE":"ÉLÉMENTS DE L’ÉVALUATEUR","Gemini structured response":"Réponse structurée Gemini","Copy JSON":"Copier le JSON","No Gemini response yet.":"Aucune réponse Gemini pour le moment.","LOCAL AUDIT LEDGER":"REGISTRE LOCAL D’AUDIT","Browser transaction history":"Historique des transactions du navigateur","Clear history":"Effacer l’historique","ACCOUNT & PLAN":"COMPTE ET OFFRE","Hosted AI quota applies":"Quota d’IA hébergée applicable","Refresh plan":"Actualiser l’offre","PQA LEARN":"PQA LEARN","Learn from your own prompt weaknesses":"Apprenez à partir des faiblesses de vos propres instructions","Learn tier+":"Offre Learn ou supérieure","Sign in with a Learn/Pro/Team/Enterprise entitlement to load lessons.":"Connectez-vous avec une autorisation Learn, Pro, Team ou Enterprise pour charger les leçons.","AI EFFICIENCY VALUE":"VALEUR D’EFFICACITÉ IA","Estimated savings and engineering productivity":"Économies estimées et productivité d’ingénierie","AUDITABLE MODEL":"MODÈLE AUDITABLE","Export JSON":"Exporter le JSON","ESTIMATED TOTAL VALUE":"VALEUR TOTALE ESTIMÉE","TOKENS AVOIDED":"JETONS ÉVITÉS","DIRECT AI COST":"COÛT DIRECT DE L’IA","estimated avoidance":"économie estimée","corrective cycles":"cycles correctifs","REWORK HOURS":"HEURES DE RETRAVAIL","modeled":"modélisé","PRODUCTIVITY VALUE":"VALEUR DE PRODUCTIVITÉ","configurable assumption":"hypothèse configurable","7 days":"7 jours","30 days":"30 jours","Savings assumptions":"Hypothèses d’économie","Reset visible ledger":"Réinitialiser le registre visible","Input $ / 1M tokens":"Entrée $ / 1 M de jetons","Output $ / 1M tokens":"Sortie $ / 1 M de jetons","Correction cycle (minutes)":"Cycle de correction (minutes)","Developer value ($/hour)":"Valeur développeur ($/heure)","Save assumptions":"Enregistrer les hypothèses","Classification: ESTIMATED. Direct AI cost uses the selected pricing profile. Productivity value uses configurable rework assumptions. Use observed provider usage when available for financial reporting.":"Classification : ESTIMÉ. Le coût direct de l’IA utilise le profil tarifaire sélectionné. La valeur de productivité repose sur des hypothèses configurables de retravail. Pour les rapports financiers, utilisez la consommation observée du fournisseur lorsqu’elle est disponible.","Project documentation":"Documentation du projet","optional · Markdown / README / text":"facultatif · Markdown / README / texte","Drop .md / README files here or click to add":"Déposez des fichiers .md / README ici ou cliquez pour les ajouter","No project documents selected.":"Aucun document de projet sélectionné.","Ephemeral: content scrubbed from local ledger after completion":"Éphémère : le contenu est supprimé du registre local après exécution","Project-context evidence":"Éléments probants du contexte projet","Upload Markdown/README files to enable evidence-backed project-context analysis.":"Ajoutez des fichiers Markdown/README pour activer l’analyse du contexte projet fondée sur des éléments probants.","RELIABILITY ENGINEERING — OWNER ONLY":"INGÉNIERIE DE FIABILITÉ — PROPRIÉTAIRE UNIQUEMENT","Platform control room":"Centre de contrôle de la plateforme","RESTRICTED":"RESTREINT","USER JOURNEYS":"PARCOURS UTILISATEUR","AI CALLS":"APPELS IA","TRAFFIC":"TRAFIC","SECURITY":"SÉCURITÉ","Traffic geography":"Géographie du trafic","Map activates after privacy-reviewed telemetry is configured.":"La carte sera activée après configuration d’une télémétrie validée du point de vue de la confidentialité.","AI configuration":"Configuration IA","Loading…":"Chargement…","No telemetry loaded.":"Aucune télémétrie chargée.","PQA home":"Accueil PQA","Language":"Langue","Reliability overview":"Vue d’ensemble de la fiabilité","Recent prompt quality trend":"Tendance récente de la qualité des instructions","Example: Look at this API and fix why it is slow. Don't break anything. Give me the files I need to change.":"Exemple : analysez cette API et corrigez la cause de sa lenteur. Préservez le comportement existant et indiquez les fichiers à modifier.","Selected logs, requirements, code excerpt, document text, acceptance criteria...":"Journaux sélectionnés, exigences, extrait de code, texte de document, critères d’acceptation...","Selected logs, requirements, code excerpt, acceptance criteria...":"Journaux sélectionnés, exigences, extrait de code, critères d’acceptation...","The recommended prompt will appear here when Gemini is configured.":"Le prompt recommandé apparaîtra ici lorsque Gemini sera configuré.","Paste a prompt first.":"Collez d’abord un prompt.","Queued…":"En file d’attente…","Running asynchronously…":"Exécution asynchrone…","Select a transaction first.":"Sélectionnez d’abord une transaction.","Administrator API token for server logs. The token is used for this request only and is not stored by the app.":"Jeton API administrateur pour les journaux serveur. Il est utilisé uniquement pour cette requête et n’est pas conservé par l’application.","Reset the visible Efficiency Wallet? This does not change prior analysis history.":"Réinitialiser le portefeuille d’efficacité visible ? Cette action ne modifie pas l’historique des analyses.","Clear browser transaction history?":"Effacer l’historique des transactions de ce navigateur ?","History cleared.":"Historique effacé.","Copied":"Copié","Testing…":"Test en cours…","Server Logs":"Journaux serveur","Estimated tokens = prompt/output token model × expected retry reduction. Token count uses ~4 characters/token. Retry probability is modeled from PQA quality score and risk level. Dollar savings use the configured planning price profile and are not provider billing records.":"Jetons estimés = modèle de jetons d’entrée/sortie × réduction attendue des nouvelles tentatives. Le comptage utilise environ 4 caractères par jeton. La probabilité de nouvelle tentative est modélisée à partir du score de qualité et du niveau de risque PQA. Les économies en dollars utilisent le profil tarifaire de planification configuré et ne constituent pas des données de facturation du fournisseur.","Savings assumptions updated. Existing ledger events retain the assumptions recorded when they were created.":"Hypothèses d’économie mises à jour. Les événements déjà enregistrés conservent les hypothèses en vigueur lors de leur création.","Reset this device savings ledger? Analysis history remains unchanged.":"Réinitialiser le registre d’économies de cet appareil ? L’historique des analyses restera inchangé.","Plan service unavailable":"Service d’offre indisponible"}};Object.assign(CATALOG.pt,{"PQA v1.9.0 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.": "PQA v1.9.0 · Benchmark v4.1 · Indicadores de risco no nível do prompt são sinais de engenharia, não garantias do comportamento do modelo.", "Not calibrated": "Não calibrado"});Object.assign(CATALOG.fr,{"PQA v1.9.0 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.": "PQA v1.9.0 · Benchmark v4.1 · Les indicateurs de risque au niveau du prompt sont des signaux d’ingénierie, pas des garanties du comportement du modèle.", "Not calibrated": "Non calibré"});Object.assign(CATALOG.fr,{"EVIDENCE STRENGTH": "FORCE DES PREUVES", "Structural evidence coverage": "Couverture structurelle des preuves", "Evidence strength": "Force des preuves"});let lang="en";
const originalText=new WeakMap(),renderedText=new WeakMap(),originalAttrs=new WeakMap(),renderedAttrs=new WeakMap();
let translating=false;
const locale=()=>LANGS[lang].locale;

function dynamic(raw){
  if(lang==="en")return raw;
  const pt=lang==="pt";
  let m;
  if((m=raw.match(/^(\d+) analyses$/)))return pt?`${m[1]} análises`:`${m[1]} analyses`;
  if((m=raw.match(/^(\d+) improvements generated$/)))return pt?`${m[1]} melhorias geradas`:`${m[1]} améliorations générées`;
  if((m=raw.match(/^(\d+) improvement generated$/)))return pt?`${m[1]} melhoria gerada`:`${m[1]} amélioration générée`;
  if((m=raw.match(/^(\d+) improved instructions$/)))return pt?`${m[1]} instruções aprimoradas`:`${m[1]} instructions améliorées`;
  if((m=raw.match(/^(\d+) improved instruction$/)))return pt?`${m[1]} instrução aprimorada`:`${m[1]} instruction améliorée`;
  if((m=raw.match(/^(\d+) files$/)))return pt?`${m[1]} arquivos`:`${m[1]} fichiers`;
  if((m=raw.match(/^(\d+) file$/)))return pt?`${m[1]} arquivo`:`${m[1]} fichier`;
  if((m=raw.match(/^(\d+) chars$/)))return pt?`${m[1]} caracteres`:`${m[1]} caractères`;
  if((m=raw.match(/^(\d+) sources$/)))return pt?`${m[1]} fontes`:`${m[1]} sources`;
  if((m=raw.match(/^(\d+) source$/)))return pt?`${m[1]} fonte`:`${m[1]} source`;
  return raw;
}

function tr(raw){return CATALOG[lang]?.[raw]||dynamic(raw)}

function translatedText(src){
  const key=src.trim();
  if(!key)return src;
  const val=tr(key);
  return val===key?src:src.replace(key,val);
}

function translateNode(el){
  if(!(el instanceof Element)||el.matches("script,style"))return;

  if(el.children.length===0&&el.textContent.trim()){
    const current=el.textContent;
    const previousRendered=renderedText.get(el);
    let src=originalText.get(el);

    // If application code changed this node after the last translation,
    // treat that new value as the source text. This keeps live counters,
    // statuses and async content translatable without restoring stale text.
    if(src===undefined||(previousRendered!==undefined&&current!==previousRendered)){
      src=current;
      originalText.set(el,src);
    }

    const target=translatedText(src);
    // Critical runtime guard: writing identical text creates a DOM mutation.
    // Without this check the MutationObserver can observe its own writes forever.
    if(current!==target)el.textContent=target;
    renderedText.set(el,target);
  }

  for(const attr of ["placeholder","title","aria-label"]){
    if(!el.hasAttribute(attr))continue;
    const current=el.getAttribute(attr);
    let originals=originalAttrs.get(el),rendered=renderedAttrs.get(el);
    if(!originals){originals={};originalAttrs.set(el,originals)}
    if(!rendered){rendered={};renderedAttrs.set(el,rendered)}
    if(!(attr in originals)||(attr in rendered&&current!==rendered[attr]))originals[attr]=current;
    const target=tr(originals[attr]);
    if(current!==target)el.setAttribute(attr,target);
    rendered[attr]=target;
  }
}

function translateTree(root=document.body){
  if(!root)return;
  translating=true;
  try{
    translateNode(root);
    root.querySelectorAll?.("*").forEach(translateNode);
  }finally{
    translating=false;
  }
}

export function detectLanguage(){
  const s=localStorage.getItem("pqa_language");
  if(LANGS[s])return s;
  const x=(navigator.languages?.[0]||navigator.language||"en").toLowerCase();
  return x.startsWith("pt")?"pt":x.startsWith("fr")?"fr":"en";
}

export function setLanguage(x){
  lang=LANGS[x]?x:"en";
  localStorage.setItem("pqa_language",lang);
  document.documentElement.lang=locale();
  translateTree();
  document.querySelectorAll("[data-pqa-lang]").forEach(b=>b.classList.toggle("active",b.dataset.pqaLang===lang));
  window.dispatchEvent(new CustomEvent("pqa:language",{detail:{language:lang,locale:locale()}}));
}

export const getLanguage=()=>lang;
export const getLocale=()=>locale();
export const t=tr;

export function languageInstruction(){
  if(lang==="pt")return "Produza toda a análise, explicações, recomendações, mensagens de risco e relatório em português brasileiro profissional, natural e idiomático. Use terminologia técnica corrente no Brasil; evite traduções literais artificiais. Preserve identificadores técnicos estáveis, como reason codes, sem tradução.";
  if(lang==="fr")return "Produisez l’analyse, les explications, les recommandations, les messages de risque et le rapport dans un français professionnel, naturel et idiomatique. Utilisez la terminologie technique consacrée et conservez les identifiants techniques stables sans traduction.";
  return "Produce the analysis, explanations, recommendations, risk messages and report in professional US English using established technical terminology. Keep stable technical identifiers unchanged.";
}

export function installLanguageUI(){
  const buttons=[...document.querySelectorAll("[data-pqa-lang]")];
  if(buttons.length!==3){
    console.error("PQA i18n initialization failed: expected three language controls.");
    return;
  }

  for(const b of buttons)b.addEventListener("click",()=>setLanguage(b.dataset.pqaLang));
  setLanguage(detectLanguage());

  if(!window.__pqaI18nDialogs){
    window.__pqaI18nDialogs=true;
    const A=window.alert.bind(window),C=window.confirm.bind(window),P=window.prompt.bind(window);
    window.alert=(m)=>A(tr(String(m)));
    window.confirm=(m)=>C(tr(String(m)));
    window.prompt=(m,d)=>P(tr(String(m)),d);
  }

  // Translate application-driven DOM updates, but never rewrite unchanged nodes.
  // The equality guards in translateNode make observer callbacks idempotent.
  const obs=new MutationObserver(ms=>{
    if(translating)return;
    const roots=new Set();
    for(const m of ms){
      if(m.type==="characterData"&&m.target.parentElement)roots.add(m.target.parentElement);
      for(const n of m.addedNodes){
        if(n.nodeType===1)roots.add(n);
        else if(n.nodeType===3&&n.parentElement)roots.add(n.parentElement);
      }
    }
    for(const root of roots)translateTree(root);
  });
  obs.observe(document.body,{childList:true,subtree:true,characterData:true});
}
Object.assign(CATALOG.pt,{
  "HALLUCINATION EXPLAINER":"EXPLICADOR DE ALUCINAÇÃO",
  "Why this prompt may hallucinate":"Por que este prompt pode gerar alucinações",
  "Risk mechanics, not a probability claim":"Mecânica de risco, não uma afirmação de probabilidade",
  "NOT CALIBRATED":"NÃO CALIBRADO",
  "PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate.":"O PQA apresenta um índice de risco no nível do prompt, não uma probabilidade calibrada de que a resposta do modelo contenha alucinação.",
  "PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate. A true probability requires outcome calibration by model, retrieval state, domain, and execution settings.":"O PQA apresenta um índice de risco no nível do prompt, não uma probabilidade calibrada de que a resposta do modelo contenha alucinação. Uma probabilidade real exige calibração por modelo, estado de recuperação, domínio e configurações de execução.",
  "ANSWERABILITY":"RESPONDIBILIDADE",
  "GROUNDING REQUIREMENT":"NECESSIDADE DE FUNDAMENTAÇÃO",
  "HALLUCINATION PRESSURE":"PRESSÃO PARA ALUCINAÇÃO",
  "ABSTENTION SAFETY":"SEGURANÇA DE ABSTENÇÃO",
  "CURRENT-FACT DEPENDENCY":"DEPENDÊNCIA DE FATOS ATUAIS",
  "Awaiting analysis":"Aguardando análise",
  "ORIGINAL":"ORIGINAL",
  "RECOMMENDED PROMPT":"PROMPT RECOMENDADO",
  "Projected reduction":"Redução projetada",
  "points":"pontos",
  "Main risk drivers":"Principais fatores de risco",
  "point contribution":"contribuição em pontos",
  "Risk categories":"Categorias de risco",
  "0–100 index":"índice 0–100",
  "What would reduce risk":"O que reduziria o risco",
  "projected change":"mudança projetada",
  "Execution conditions":"Condições de execução",
  "scenario sensitivity":"sensibilidade por cenário",
  "No material prompt-level hallucination drivers detected.":"Nenhum fator material de alucinação no nível do prompt foi detectado.",
  "Factual fabrication":"Fabricação factual",
  "Unsupported inference":"Inferência sem suporte",
  "Citation fabrication":"Fabricação de citações",
  "Temporal staleness":"Desatualização temporal",
  "Entity ambiguity":"Ambiguidade de entidade",
  "Projected risk":"Risco projetado",
  "No additional risk-reduction intervention is indicated by the deterministic layer.":"A camada determinística não indica nenhuma intervenção adicional de redução de risco.",
  "Model only":"Somente modelo",
  "With authoritative retrieval":"Com recuperação de fontes autorizadas",
  "With supplied evidence":"Com evidências fornecidas",
  "No external retrieval or supplied authoritative evidence.":"Sem recuperação externa ou evidências autorizadas fornecidas.",
  "Execution can retrieve current authoritative sources and cite them.":"A execução pode recuperar fontes atuais e autorizadas e citá-las.",
  "Execution is constrained to sufficient, relevant supplied evidence.":"A execução fica restrita a evidências fornecidas, suficientes e relevantes.",
  "Risk index and projected reductions are engineering decision-support signals, not empirical probabilities or guarantees of model behavior.":"O índice de risco e as reduções projetadas são sinais de engenharia para apoio à decisão, não probabilidades empíricas nem garantias do comportamento do modelo.",
  "Forced certainty":"Certeza forçada",
  "Abstention is prohibited":"Abstenção proibida",
  "Uncertainty/limitations are suppressed":"Incerteza/limitações suprimidas",
  "Prompt encourages guessing or unsupported inference":"O prompt incentiva adivinhação ou inferência sem suporte",
  "Prompt permits fabricated citations or sources":"O prompt permite citações ou fontes fabricadas",
  "Current facts requested without retrieval/grounding":"Fatos atuais solicitados sem recuperação/fundamentação",
  "Factual task has weak grounding requirements":"A tarefa factual possui requisitos fracos de fundamentação",
  "No safe insufficient-evidence behavior detected":"Nenhum comportamento seguro para evidência insuficiente foi detectado",
  "Evidence is supplied but claims are not tied to it":"Há evidências fornecidas, mas as afirmações não estão vinculadas a elas",
  "Conflicting evidence may be silently guessed through":"Evidências conflitantes podem ser resolvidas por suposição silenciosa",
  "Prompt encourages causal overclaiming":"O prompt incentiva conclusões causais excessivas",
  "Exact numbers/dates are requested":"São solicitados números/datas exatos",
  "Core task context is missing":"Falta contexto essencial da tarefa",
  "Potentially ambiguous entity/reference language":"Linguagem de entidade/referência potencialmente ambígua",
  "Prompt depends on time-sensitive information":"O prompt depende de informações sensíveis ao tempo",
  "Semantic judge also identified high hallucination risk":"O avaliador semântico também identificou alto risco de alucinação",
  "Semantic judge identified medium hallucination risk":"O avaliador semântico identificou risco médio de alucinação",
  "Permit explicit uncertainty/abstention":"Permitir incerteza/abstenção explícita",
  "Require authoritative retrieval for current facts":"Exigir recuperação de fontes autorizadas para fatos atuais",
  "Add an explicit evidence/grounding boundary":"Adicionar um limite explícito de evidência/fundamentação",
  "Supply missing task/entity context":"Fornecer o contexto ausente da tarefa/entidade",
  "Require verifiable citations and forbid invented sources":"Exigir citações verificáveis e proibir fontes inventadas",
  "Require conflicts to be surfaced rather than guessed through":"Exigir que conflitos sejam expostos em vez de resolvidos por suposição",
  "Allow ranges/uncertainty when exact values cannot be supported":"Permitir intervalos/incerteza quando valores exatos não puderem ser sustentados",
  "Very High":"Muito alto","High":"Alto","Moderate":"Moderado","Low":"Baixo","Very Low":"Muito baixo","Good":"Bom","Strong":"Forte","Weak":"Fraco","Unsafe":"Inseguro","Helpful":"Útil","Recommended":"Recomendado","Required":"Obrigatório","Critical":"Crítico","None":"Nenhum"
});
Object.assign(CATALOG.fr,{
  "HALLUCINATION EXPLAINER":"EXPLICATION DU RISQUE D’HALLUCINATION",
  "Why this prompt may hallucinate":"Pourquoi ce prompt peut halluciner",
  "Risk mechanics, not a probability claim":"Mécanique du risque, pas une affirmation probabiliste",
  "NOT CALIBRATED":"NON CALIBRÉ",
  "PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate.":"PQA fournit un indice de risque au niveau du prompt, et non une probabilité calibrée qu’une réponse du modèle hallucine.",
  "PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate. A true probability requires outcome calibration by model, retrieval state, domain, and execution settings.":"PQA fournit un indice de risque au niveau du prompt, et non une probabilité calibrée qu’une réponse du modèle hallucine. Une probabilité réelle nécessite une calibration par modèle, état de récupération, domaine et paramètres d’exécution.",
  "ANSWERABILITY":"CAPACITÉ À RÉPONDRE",
  "GROUNDING REQUIREMENT":"BESOIN D’ANCRAGE",
  "HALLUCINATION PRESSURE":"PRESSION D’HALLUCINATION",
  "ABSTENTION SAFETY":"SÉCURITÉ D’ABSTENTION",
  "CURRENT-FACT DEPENDENCY":"DÉPENDANCE AUX FAITS ACTUELS",
  "Awaiting analysis":"En attente d’analyse",
  "ORIGINAL":"ORIGINAL",
  "RECOMMENDED PROMPT":"PROMPT RECOMMANDÉ",
  "Projected reduction":"Réduction projetée",
  "points":"points",
  "Main risk drivers":"Principaux facteurs de risque",
  "point contribution":"contribution en points",
  "Risk categories":"Catégories de risque",
  "0–100 index":"indice 0–100",
  "What would reduce risk":"Ce qui réduirait le risque",
  "projected change":"variation projetée",
  "Execution conditions":"Conditions d’exécution",
  "scenario sensitivity":"sensibilité par scénario",
  "No material prompt-level hallucination drivers detected.":"Aucun facteur matériel d’hallucination au niveau du prompt n’a été détecté.",
  "Factual fabrication":"Fabrication factuelle",
  "Unsupported inference":"Inférence non étayée",
  "Citation fabrication":"Fabrication de citations",
  "Temporal staleness":"Obsolescence temporelle",
  "Entity ambiguity":"Ambiguïté d’entité",
  "Projected risk":"Risque projeté",
  "No additional risk-reduction intervention is indicated by the deterministic layer.":"La couche déterministe n’indique aucune intervention supplémentaire de réduction du risque.",
  "Model only":"Modèle seul",
  "With authoritative retrieval":"Avec récupération de sources faisant autorité",
  "With supplied evidence":"Avec preuves fournies",
  "No external retrieval or supplied authoritative evidence.":"Sans récupération externe ni preuves faisant autorité fournies.",
  "Execution can retrieve current authoritative sources and cite them.":"L’exécution peut récupérer des sources actuelles faisant autorité et les citer.",
  "Execution is constrained to sufficient, relevant supplied evidence.":"L’exécution est limitée à des preuves fournies suffisantes et pertinentes.",
  "Risk index and projected reductions are engineering decision-support signals, not empirical probabilities or guarantees of model behavior.":"L’indice de risque et les réductions projetées sont des signaux d’ingénierie d’aide à la décision, et non des probabilités empiriques ni des garanties du comportement du modèle.",
  "Forced certainty":"Certitude forcée",
  "Abstention is prohibited":"Abstention interdite",
  "Uncertainty/limitations are suppressed":"Incertitude/limitations supprimées",
  "Prompt encourages guessing or unsupported inference":"Le prompt encourage les suppositions ou inférences non étayées",
  "Prompt permits fabricated citations or sources":"Le prompt autorise des citations ou sources fabriquées",
  "Current facts requested without retrieval/grounding":"Faits actuels demandés sans récupération/ancrage",
  "Factual task has weak grounding requirements":"La tâche factuelle a de faibles exigences d’ancrage",
  "No safe insufficient-evidence behavior detected":"Aucun comportement sûr en cas de preuves insuffisantes détecté",
  "Evidence is supplied but claims are not tied to it":"Des preuves sont fournies mais les affirmations n’y sont pas reliées",
  "Conflicting evidence may be silently guessed through":"Des preuves contradictoires peuvent être résolues silencieusement par supposition",
  "Prompt encourages causal overclaiming":"Le prompt encourage des affirmations causales excessives",
  "Exact numbers/dates are requested":"Des nombres/dates exacts sont demandés",
  "Core task context is missing":"Le contexte essentiel de la tâche manque",
  "Potentially ambiguous entity/reference language":"Langage d’entité/référence potentiellement ambigu",
  "Prompt depends on time-sensitive information":"Le prompt dépend d’informations sensibles au temps",
  "Semantic judge also identified high hallucination risk":"Le juge sémantique a également identifié un risque élevé d’hallucination",
  "Semantic judge identified medium hallucination risk":"Le juge sémantique a identifié un risque moyen d’hallucination",
  "Permit explicit uncertainty/abstention":"Autoriser explicitement l’incertitude/l’abstention",
  "Require authoritative retrieval for current facts":"Exiger une récupération de sources faisant autorité pour les faits actuels",
  "Add an explicit evidence/grounding boundary":"Ajouter une limite explicite de preuve/ancrage",
  "Supply missing task/entity context":"Fournir le contexte manquant de la tâche/entité",
  "Require verifiable citations and forbid invented sources":"Exiger des citations vérifiables et interdire les sources inventées",
  "Require conflicts to be surfaced rather than guessed through":"Exiger que les conflits soient signalés plutôt que résolus par supposition",
  "Allow ranges/uncertainty when exact values cannot be supported":"Autoriser des plages/incertitudes lorsque les valeurs exactes ne sont pas étayées",
  "Very High":"Très élevé","High":"Élevé","Moderate":"Modéré","Low":"Faible","Very Low":"Très faible","Good":"Bon","Strong":"Fort","Weak":"Faible","Unsafe":"Dangereux","Helpful":"Utile","Recommended":"Recommandé","Required":"Requis","Critical":"Critique","None":"Aucun"
});
Object.assign(CATALOG.pt,{"Risk index":"Índice de risco","drivers":"fatores"});
Object.assign(CATALOG.fr,{"Risk index":"Indice de risque","drivers":"facteurs"});

Object.assign(CATALOG.pt,{"PQA v1.9.1 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.":"PQA v1.9.1 · Benchmark v4.1 · Indicadores de risco no nível do prompt são sinais de engenharia, não garantias do comportamento do modelo."});
Object.assign(CATALOG.fr,{"PQA v1.9.1 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.":"PQA v1.9.1 · Benchmark v4.1 · Les indicateurs de risque au niveau du prompt sont des signaux d’ingénierie, pas des garanties du comportement du modèle."});

Object.assign(CATALOG.pt,{
"Limited file context":"Contexto limitado de arquivo","1 text file · 256 KB max":"1 arquivo de texto · máximo de 256 KB","Community":"Comunidade","Upload one text file":"Enviar um arquivo de texto","Scanned locally before its text is added to context.":"Verificado localmente antes que o texto seja adicionado ao contexto.",".txt .md .json .csv .yaml .js .ts .py .html .xml .log":".txt .md .json .csv .yaml .js .ts .py .html .xml .log","No file selected.":"Nenhum arquivo selecionado.","PQA Guard Community":"PQA Guard Community","pre-execution input scan":"verificação de entrada antes da execução","NOT SCANNED":"NÃO VERIFICADO","Scans prompts and uploaded text for prompt injection, instruction override, secret-exfiltration requests, encoded payloads, credential material, and active-script indicators.":"Verifica prompts e textos enviados em busca de injeção de prompt, tentativa de substituir instruções, solicitações de exfiltração de segredos, cargas codificadas, material de credenciais e indicadores de scripts ativos.","Run an analysis or upload a file to scan.":"Execute uma análise ou envie um arquivo para verificar.","Heuristic defense layer only. It is not antivirus, a malware sandbox, or a guarantee that content is safe.":"Camada heurística de defesa apenas. Não é antivírus, sandbox de malware nem garantia de que o conteúdo seja seguro.","CLEAR":"LIMPO","HIGH":"ALTO","MEDIUM":"MODERADO","LOW":"BAIXO","Instruction override / prompt injection":"Substituição de instruções / injeção de prompt","Role or policy manipulation":"Manipulação de função ou política","Secret or system-prompt exfiltration request":"Solicitação de exfiltração de segredo ou prompt de sistema","Potential destructive/tool-abuse instruction":"Possível instrução destrutiva ou abuso de ferramenta","Large encoded/obfuscated payload":"Carga codificada/ofuscada extensa","Possible credential/private-key material":"Possível material de credencial/chave privada","Active script content":"Conteúdo de script ativo","No community scanner indicators detected.":"Nenhum indicador do scanner Community foi detectado.","Scanning file…":"Verificando arquivo…","Blocked":"Bloqueado","file not allowed":"arquivo não permitido","File exceeds 256 KB Community limit":"O arquivo excede o limite Community de 256 KB","Executable, macro-enabled, binary, or unsupported file type is blocked":"Tipos executáveis, com macro, binários ou não compatíveis são bloqueados","Binary/null-byte content is not accepted in Community Edition":"Conteúdo binário/com byte nulo não é aceito na Edição Community","scanned":"verificado","clear":"limpo","high":"alto","medium":"moderado","low":"baixo","File scan failed":"Falha na verificação do arquivo","PQA Guard found high-risk input indicators. Continue analysis anyway?":"O PQA Guard encontrou indicadores de entrada de alto risco. Continuar a análise mesmo assim?","PQA v1.10.0 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.":"PQA v1.10.0 · Benchmark v4.1 · Indicadores de risco no nível do prompt são sinais de engenharia, não garantias do comportamento do modelo."});
Object.assign(CATALOG.fr,{
"Limited file context":"Contexte de fichier limité","1 text file · 256 KB max":"1 fichier texte · 256 Ko max","Community":"Communauté","Upload one text file":"Téléverser un fichier texte","Scanned locally before its text is added to context.":"Analysé localement avant que son texte soit ajouté au contexte.",".txt .md .json .csv .yaml .js .ts .py .html .xml .log":".txt .md .json .csv .yaml .js .ts .py .html .xml .log","No file selected.":"Aucun fichier sélectionné.","PQA Guard Community":"PQA Guard Community","pre-execution input scan":"analyse des entrées avant exécution","NOT SCANNED":"NON ANALYSÉ","Scans prompts and uploaded text for prompt injection, instruction override, secret-exfiltration requests, encoded payloads, credential material, and active-script indicators.":"Analyse les prompts et textes téléversés pour détecter l’injection de prompt, le contournement d’instructions, les demandes d’exfiltration de secrets, les charges encodées, les éléments d’identification et les indicateurs de scripts actifs.","Run an analysis or upload a file to scan.":"Lancez une analyse ou téléversez un fichier à examiner.","Heuristic defense layer only. It is not antivirus, a malware sandbox, or a guarantee that content is safe.":"Couche de défense heuristique uniquement. Ce n’est ni un antivirus, ni un bac à sable antimalware, ni une garantie que le contenu est sûr.","CLEAR":"AUCUN SIGNAL","HIGH":"ÉLEVÉ","MEDIUM":"MODÉRÉ","LOW":"FAIBLE","Instruction override / prompt injection":"Contournement d’instructions / injection de prompt","Role or policy manipulation":"Manipulation de rôle ou de politique","Secret or system-prompt exfiltration request":"Demande d’exfiltration de secret ou de prompt système","Potential destructive/tool-abuse instruction":"Instruction potentiellement destructive ou abus d’outil","Large encoded/obfuscated payload":"Charge encodée/obfusquée importante","Possible credential/private-key material":"Éventuels identifiants ou clé privée","Active script content":"Contenu de script actif","No community scanner indicators detected.":"Aucun indicateur du scanner Community détecté.","Scanning file…":"Analyse du fichier…","Blocked":"Bloqué","file not allowed":"fichier non autorisé","File exceeds 256 KB Community limit":"Le fichier dépasse la limite Community de 256 Ko","Executable, macro-enabled, binary, or unsupported file type is blocked":"Les fichiers exécutables, avec macros, binaires ou non pris en charge sont bloqués","Binary/null-byte content is not accepted in Community Edition":"Le contenu binaire/avec octet nul n’est pas accepté dans l’édition Community","scanned":"analysé","clear":"aucun signal","high":"élevé","medium":"modéré","low":"faible","File scan failed":"Échec de l’analyse du fichier","PQA Guard found high-risk input indicators. Continue analysis anyway?":"PQA Guard a détecté des indicateurs d’entrée à haut risque. Continuer quand même l’analyse ?","PQA v1.10.0 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.":"PQA v1.10.0 · Benchmark v4.1 · Les indicateurs de risque au niveau du prompt sont des signaux d’ingénierie, pas des garanties du comportement du modèle."});
Object.assign(CATALOG.pt,{"No analysis yet.":"Nenhuma análise realizada."});
Object.assign(CATALOG.fr,{"No analysis yet.":"Aucune analyse effectuée."});
Object.assign(CATALOG.pt,{
"Scanned locally and by the central PQA security control plane before its text is added to context.":"Verificado localmente e pelo plano central de controle de segurança do PQA antes que o texto seja adicionado ao contexto.",
"Suspicious content is never processed. Three suspicious attempts automatically block the client network until the PQA owner clears it. PQA Guard is a pre-execution defense layer, not antivirus or a malware sandbox.":"Conteúdo suspeito nunca é processado. Três tentativas suspeitas bloqueiam automaticamente a rede do cliente até que o proprietário do PQA libere o bloqueio. O PQA Guard é uma camada de defesa pré-execução, não um antivírus nem uma sandbox de malware.",
"PQA Guard detected suspicious input. The request will not be processed.":"O PQA Guard detectou uma entrada suspeita. A requisição não será processada.",
"PQA Guard detected suspicious input. The request will not be processed. Remaining attempts before network block: {count}":"O PQA Guard detectou uma entrada suspeita. A requisição não será processada. Tentativas restantes antes do bloqueio da rede: {count}",
"The file was not processed because the security scan could not be completed.":"O arquivo não foi processado porque a verificação de segurança não pôde ser concluída.",
"suspicious content detected":"conteúdo suspeito detectado","PQA v1.11.0 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.":"PQA v1.11.0 · Benchmark v4.1 · Indicadores de risco no nível do prompt são sinais de engenharia, não garantias do comportamento do modelo."
});
Object.assign(CATALOG.fr,{
"Scanned locally and by the central PQA security control plane before its text is added to context.":"Analysé localement et par le plan de contrôle de sécurité central de PQA avant que le texte soit ajouté au contexte.",
"Suspicious content is never processed. Three suspicious attempts automatically block the client network until the PQA owner clears it. PQA Guard is a pre-execution defense layer, not antivirus or a malware sandbox.":"Le contenu suspect n’est jamais traité. Trois tentatives suspectes bloquent automatiquement le réseau du client jusqu’à ce que le propriétaire de PQA lève le blocage. PQA Guard est une couche de défense pré-exécution, et non un antivirus ni un bac à sable antimalware.",
"PQA Guard detected suspicious input. The request will not be processed.":"PQA Guard a détecté une entrée suspecte. La requête ne sera pas traitée.",
"PQA Guard detected suspicious input. The request will not be processed. Remaining attempts before network block: {count}":"PQA Guard a détecté une entrée suspecte. La requête ne sera pas traitée. Tentatives restantes avant blocage du réseau : {count}",
"The file was not processed because the security scan could not be completed.":"Le fichier n’a pas été traité car l’analyse de sécurité n’a pas pu être terminée.",
"suspicious content detected":"contenu suspect détecté","PQA v1.11.0 · Benchmark v4.1 · Prompt-level risk indicators are engineering signals, not guarantees of model behavior.":"PQA v1.11.0 · Benchmark v4.1 · Les indicateurs de risque au niveau du prompt sont des signaux d’ingénierie, et non des garanties du comportement du modèle."
});

Object.assign(CATALOG.pt,{"Suspicious content is never processed. The default limit is three suspicious attempts before the client network is blocked until the PQA owner clears it; the owner can configure this limit.":"Conteúdo suspeito nunca é processado. O limite padrão é de três tentativas suspeitas antes de a rede do cliente ser bloqueada até que o proprietário do PQA libere o bloqueio; o proprietário pode configurar esse limite."});
Object.assign(CATALOG.fr,{"Suspicious content is never processed. The default limit is three suspicious attempts before the client network is blocked until the PQA owner clears it; the owner can configure this limit.":"Le contenu suspect n’est jamais traité. La limite par défaut est de trois tentatives suspectes avant que le réseau du client soit bloqué jusqu’à ce que le propriétaire de PQA lève le blocage ; le propriétaire peut configurer cette limite."});
Object.assign(CATALOG.pt,{"Suspicious content is never processed. The default limit is three suspicious attempts before the client network is blocked until the PQA owner clears it; the owner can configure this limit. PQA Guard is a pre-execution defense layer, not antivirus or a malware sandbox.":"Conteúdo suspeito nunca é processado. O limite padrão é de três tentativas suspeitas antes de a rede do cliente ser bloqueada até que o proprietário do PQA libere o bloqueio; o proprietário pode configurar esse limite. O PQA Guard é uma camada de defesa pré-execução, não um antivírus nem uma sandbox de malware."});
Object.assign(CATALOG.fr,{"Suspicious content is never processed. The default limit is three suspicious attempts before the client network is blocked until the PQA owner clears it; the owner can configure this limit. PQA Guard is a pre-execution defense layer, not antivirus or a malware sandbox.":"Le contenu suspect n’est jamais traité. La limite par défaut est de trois tentatives suspectes avant que le réseau du client soit bloqué jusqu’à ce que le propriétaire de PQA lève le blocage ; le propriétaire peut configurer cette limite. PQA Guard est une couche de défense pré-exécution, et non un antivirus ni un bac à sable antimalware."});
