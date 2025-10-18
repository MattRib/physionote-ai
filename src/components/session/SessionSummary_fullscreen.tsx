"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
	Activity,
	AlertCircle,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	Clipboard,
	Copy,
	Download,
	FileText,
	Save,
	Stethoscope,
	TrendingUp,
	User,
	X,
	Trash2
} from "lucide-react";
import NoteAIDisclaimer from "./NoteAIDisclaimer";

interface SessionSummaryProps {
	patient: { id: string; name: string };
	duration: number;
	transcription: string[];
	generatedNote?: any; // Nota gerada pela IA
	onSave: () => void;
	onCancel: () => void;
	showAIDisclaimer?: boolean;
}

type SectionKey =
	| "resumo"
	| "anamnese"
	| "diagnostico"
	| "intervencoes"
	| "resposta"
	| "orientacoes"
	| "plano"
	| "transcricao";

// Função para normalizar nota da API para formato do componente
const normalizeNote = (apiNote: any, patientName: string) => {
	if (!apiNote) return getMockSessionNote(patientName);
	
	return {
		resumoExecutivo: {
			queixaPrincipal: apiNote.resumoExecutivo?.queixaPrincipal || "",
			nivelDor: apiNote.resumoExecutivo?.nivelDor || 0,
			evolucao: apiNote.resumoExecutivo?.evolucao || ""
		},
		anamnese: {
			historicoAtual: apiNote.anamnese?.historicoAtual || "",
			antecedentesPessoais: apiNote.anamnese?.antecedentesPessoais || "",
			medicamentos: apiNote.anamnese?.medicamentos || "",
			objetivos: apiNote.anamnese?.objetivos || ""
		},
		diagnosticoFisioterapeutico: {
			principal: apiNote.diagnosticoFisioterapeutico?.principal || "",
			secundario: apiNote.diagnosticoFisioterapeutico?.secundarios || 
			           apiNote.diagnosticoFisioterapeutico?.secundario || [],
			cif: apiNote.diagnosticoFisioterapeutico?.cif || ""
		},
		intervencoes: {
			tecnicasManuais: apiNote.intervencoes?.tecnicasManuais || [],
			exerciciosTerapeuticos: apiNote.intervencoes?.exerciciosTerapeuticos || [],
			recursosEletrotermofototerapeticos: apiNote.intervencoes?.recursosEletrotermo || 
			                                   apiNote.intervencoes?.recursosEletrotermofototerapeticos || []
		},
		respostaTratamento: {
			imediata: apiNote.respostaTratamento?.imediata || "",
			efeitos: apiNote.respostaTratamento?.efeitos || "",
			feedback: apiNote.respostaTratamento?.feedback || ""
		},
		orientacoes: {
			domiciliares: apiNote.orientacoes?.domiciliares || [],
			ergonomicas: apiNote.orientacoes?.ergonomicas || [],
			precaucoes: apiNote.orientacoes?.precaucoes || []
		},
		planoTratamento: {
			frequencia: apiNote.planoTratamento?.frequencia || "",
			duracaoPrevista: apiNote.planoTratamento?.duracaoPrevista || "",
			objetivosCurtoPrazo: apiNote.planoTratamento?.objetivosCurtoPrazo || [],
			objetivosLongoPrazo: apiNote.planoTratamento?.objetivosLongoPrazo || [],
			criteriosAlta: apiNote.planoTratamento?.criteriosAlta || []
		},
		observacoesAdicionais: apiNote.observacoesAdicionais || "",
		proximaSessao: {
			data: apiNote.proximaSessao?.data || "",
			foco: apiNote.proximaSessao?.foco || ""
		}
	};
};

const getMockSessionNote = (patientName: string) => ({
	resumoExecutivo: {
		queixaPrincipal:
			"Dor lombar crônica há aproximadamente 3 meses, com intensificação nos últimos 15 dias",
		nivelDor: 7,
		evolucao: "Paciente apresentou melhora de 30% em relação à última sessão"
	},
	anamnese: {
		historicoAtual:
			"Paciente relata início insidioso de dor na região lombar há 3 meses, sem trauma aparente. Dor tipo queimação, intensidade 7/10, com irradiação para membro inferior direito até joelho. Piora com permanência prolongada em pé e melhora parcial com repouso. Paciente trabalha como vendedor, permanecendo 8h em pé diariamente.",
		antecedentesPessoais:
			"Sedentário, sobrepeso (IMC 28), sem histórico de cirurgias prévias na coluna",
		medicamentos: "Dipirona 1g SOS para dor (uso irregular)",
		objetivos:
			"Retornar às atividades de trabalho sem limitações e poder praticar caminhada recreativa"
	},
	diagnosticoFisioterapeutico: {
		principal: "Lombalgia mecânica crônica com radiculopatia L5-S1 à direita",
		secundario: [
			"Desequilíbrio muscular da região lombopélvica",
			"Fraqueza da musculatura estabilizadora do core",
			"Encurtamento de musculatura posterior de membros inferiores",
			"Hiperlordose lombar postural"
		],
		cif:
			"b28013 (Dor na região lombar - grave) + b7101 (Mobilidade das articulações da coluna lombar - limitação moderada)"
	},
	intervencoes: {
		tecnicasManuais: [
			"Mobilização articular de L4-L5 grau III (Maitland) - 3 séries de 30 segundos",
			"Liberação miofascial de quadrado lombar bilateral - 5 minutos cada lado",
			"Massagem de deslizamento profundo em paravertebrais - 8 minutos",
			"Técnica de energia muscular para piriforme direito - 3 repetições"
		],
		exerciciosTerapeuticos: [
			"Exercício de estabilização segmentar - ponte com sustentação isométrica 10s x 10 repetições",
			"Ativação de transverso abdominal em 4 apoios - 3 séries de 10 repetições",
			"Alongamento de isquiotibiais em decúbito dorsal - 3 séries de 30s cada perna",
			"Mobilização neural do nervo ciático - 2 séries de 10 repetições"
		],
		recursosEletrotermofototerapeticos: [
			"TENS modo burst na região lombar - 20 minutos (analgesia)",
			"Compressa quente em região lombar - 10 minutos (pré-tratamento)"
		]
	},
	respostaTratamento: {
		imediata:
			"Paciente refere diminuição da dor de 7/10 para 4/10 após sessão. Melhora de 30% na amplitude de flexão do tronco. Relata sensação de 'leveza' e melhor mobilidade.",
		efeitos: "Sem efeitos adversos relatados. Paciente tolerou bem todas as intervenções.",
		feedback: "Paciente muito satisfeito com resultado imediato, motivado para continuar tratamento"
	},
	orientacoes: {
		domiciliares: [
			"Aplicar bolsa de água morna na região lombar por 15-20 minutos, 2x ao dia",
			"Realizar alongamento de isquiotibiais 3x ao dia (manhã, tarde e noite)",
			"Praticar exercício de ativação do transverso abdominal em casa - 2 séries de 10 repetições pela manhã",
			"Evitar permanecer mais de 2 horas na mesma posição"
		],
		ergonomicas: [
			"Utilizar apoio lombar na cadeira do trabalho",
			"Fazer pausas de 5 minutos a cada 1 hora para alongamentos",
			"Ao pegar objetos do chão, agachar flexionando joelhos (não curvar coluna)",
			"Dormir em decúbito lateral com travesseiro entre os joelhos"
		],
		precaucoes: [
			"Evitar movimentos de rotação combinada com flexão do tronco",
			"Não carregar peso acima de 5kg por enquanto",
			"Caso dor aumente significativamente ou apareça formigamento intenso, entrar em contato"
		]
	},
	planoTratamento: {
		frequencia: "3x por semana nas próximas 2 semanas, depois reavaliar para 2x por semana",
		duracaoPrevista: "8-12 semanas para recuperação funcional completa",
		objetivosCurtoPrazo: [
			"Reduzir dor para 3/10 ou menos em 2 semanas",
			"Aumentar ADM de flexão do tronco para 75° em 2 semanas",
			"Melhorar força de abdominais para 4/5 em 3 semanas"
		],
		objetivosLongoPrazo: [
			"Retorno ao trabalho sem limitações em 6-8 semanas",
			"Iniciar programa de caminhada recreativa em 8 semanas",
			"Recuperação completa da ADM lombar em 10-12 semanas",
			"Força muscular 5/5 em toda musculatura do core em 12 semanas"
		],
		criteriosAlta: [
			"Ausência de dor ou dor mínima (≤2/10)",
			"ADM completa e indolor",
			"Força muscular 5/5",
			"Retorno às atividades funcionais sem limitações",
			"Paciente capaz de realizar programa de exercícios domiciliares de manutenção"
		]
	},
	observacoesAdicionais:
		"Paciente demonstra boa compreensão das orientações e alta motivação para tratamento. Reforçada importância da adesão aos exercícios domiciliares e modificações ergonômicas para sucesso do tratamento. Enfatizada necessidade de perda de peso gradual para diminuir sobrecarga lombar (encaminhamento para nutricionista sugerido).",
	proximaSessao: {
		data: "2 dias",
		foco: "Progressão de exercícios de estabilização, continuidade de técnicas manuais e reavaliação da dor"
	}
});

const formatDateTime = (datetime: string) => {
	const dateObj = new Date(datetime);
	return {
		date: dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
		time: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
	};
};

const buildNoteText = (sessionData: {
	patient_name: string;
	duration_minutes: number;
	date: string;
	time: string;
}) => (note: ReturnType<typeof getMockSessionNote>) => `
NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA
Paciente: ${sessionData.patient_name}
Data: ${sessionData.date} às ${sessionData.time}
Duração: ${sessionData.duration_minutes} minutos

QUEIXA PRINCIPAL: ${note.resumoExecutivo.queixaPrincipal}
DOR: ${note.resumoExecutivo.nivelDor}/10
EVOLUÇÃO: ${note.resumoExecutivo.evolucao}

ANAMNESE:
- Histórico Atual: ${note.anamnese.historicoAtual}
- Antecedentes Pessoais: ${note.anamnese.antecedentesPessoais}
- Medicamentos: ${note.anamnese.medicamentos}
- Objetivos: ${note.anamnese.objetivos}

DIAGNÓSTICO PRINCIPAL: ${note.diagnosticoFisioterapeutico.principal}
SECUNDÁRIOS:
${note.diagnosticoFisioterapeutico.secundario.map((item) => `- ${item}`).join("\n")}
CIF: ${note.diagnosticoFisioterapeutico.cif}

INTERVENÇÕES:
- Técnicas Manuais:\n${note.intervencoes.tecnicasManuais.map((item) => `  • ${item}`).join("\n")}
- Exercícios Terapêuticos:\n${note.intervencoes.exerciciosTerapeuticos.map((item) => `  • ${item}`).join("\n")}
- Recursos Eletrotermofototerapêuticos:\n${note.intervencoes.recursosEletrotermofototerapeticos.map((item) => `  • ${item}`).join("\n")}

RESPOSTA IMEDIATA: ${note.respostaTratamento.imediata}
EFEITOS ADVERSOS: ${note.respostaTratamento.efeitos}
FEEDBACK: ${note.respostaTratamento.feedback}

ORIENTAÇÕES DOMICILIARES:\n${note.orientacoes.domiciliares.map((item) => `• ${item}`).join("\n")}
ERGONÔMICAS:\n${note.orientacoes.ergonomicas.map((item) => `• ${item}`).join("\n")}
PRECAUÇÕES:\n${note.orientacoes.precaucoes.map((item) => `• ${item}`).join("\n")}

PLANO:
- Frequência: ${note.planoTratamento.frequencia}
- Duração Prevista: ${note.planoTratamento.duracaoPrevista}
- Objetivos (Curto Prazo):\n${note.planoTratamento.objetivosCurtoPrazo.map((item) => `  ${item}`).join("\n")}
- Objetivos (Longo Prazo):\n${note.planoTratamento.objetivosLongoPrazo.map((item) => `  ${item}`).join("\n")}
- Critérios de Alta:\n${note.planoTratamento.criteriosAlta.map((item) => `  ${item}`).join("\n")}

OBSERVAÇÕES ADICIONAIS: ${note.observacoesAdicionais}
PRÓXIMA SESSÃO: Retorno em ${note.proximaSessao.data} | Foco: ${note.proximaSessao.foco}
`;

const SessionSummary: React.FC<SessionSummaryProps> = ({
	patient,
	duration,
	transcription,
	generatedNote,
	onSave,
	onCancel,
	showAIDisclaimer = true
}) => {
	const [copied, setCopied] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showDiscardModal, setShowDiscardModal] = useState(false);
	const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(() =>
		new Set<SectionKey>(["resumo", "anamnese", "diagnostico", "intervencoes", "resposta", "orientacoes", "plano"])
	);
	
	// Usar nota gerada pela IA se disponível, senão usar mock
	const [note, setNote] = useState(() => normalizeNote(generatedNote, patient.name));

	// Atualizar nota quando generatedNote mudar
	useEffect(() => {
		if (generatedNote) {
			console.log('Usando nota gerada pela IA:', generatedNote);
			setNote(normalizeNote(generatedNote, patient.name));
		}
	}, [generatedNote, patient.name]);

	const sessionData = useMemo(
		() => ({
			id: `session-${Date.now()}`,
			patient_name: patient.name,
			session_datetime: new Date().toISOString(),
			duration_minutes: Math.max(1, Math.floor(duration / 60))
		}),
		[patient.name, duration]
	);

	const { date, time } = formatDateTime(sessionData.session_datetime);

	const noteText = useMemo(
		() =>
			buildNoteText({
				patient_name: sessionData.patient_name,
				duration_minutes: sessionData.duration_minutes,
				date,
				time
			})(note),
		[date, time, note, sessionData.duration_minutes, sessionData.patient_name]
	);

	const handleCopyNote = () => {
		navigator.clipboard.writeText(noteText.trim());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleSaveClick = async () => {
		setIsSaving(true);
		try {
			await onSave();
		} catch (error) {
			console.error('Error saving session:', error);
			setIsSaving(false);
		}
	};

	const handleClose = () => {
		setShowDiscardModal(true);
	};

	const handleConfirmDiscard = () => {
		setShowDiscardModal(false);
		onCancel();
	};

	const handleCancelDiscard = () => {
		setShowDiscardModal(false);
	};

	const toggleSection = (section: SectionKey) => {
		const next = new Set(expandedSections);
		if (next.has(section)) {
			next.delete(section);
		} else {
			next.add(section);
		}
		setExpandedSections(next);
	};

	const SectionHeader = ({
		id,
		icon: Icon,
		title,
		color
	}: {
		id: SectionKey;
		icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		title: string;
		color: string;
	}) => {
		const isExpanded = expandedSections.has(id);
		return (
			<button
				onClick={() => toggleSection(id)}
				className="flex w-full items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-5 py-4 text-left shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] transition-colors hover:bg-white"
			>
				<div className="flex items-center gap-3">
					<span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
						<Icon className="h-5 w-5 text-white" aria-hidden="true" />
					</span>
					<h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>
				</div>
				{isExpanded ? (
					<ChevronUp className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
				) : (
					<ChevronDown className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
				)}
			</button>
		);
	};

	// Modal de confirmação para descarte
	const DiscardModal = () => {
		if (!showDiscardModal) return null;

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
				<div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-slide-up-modal overflow-hidden">
					{/* Header com gradiente */}
					<div className="relative px-8 py-6 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 text-white">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_70%)]" />
						<div className="relative flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
								<Trash2 className="h-6 w-6" />
							</div>
							<div>
								<h3 className="text-xl font-semibold">Descartar sessão</h3>
								<p className="text-red-100 text-sm mt-1">Esta ação não pode ser desfeita</p>
							</div>
						</div>
					</div>

					{/* Conteúdo */}
					<div className="px-8 py-6 space-y-6">
						{/* Aviso principal */}
						<div className="rounded-2xl bg-red-50 border border-red-200 p-4">
							<div className="flex gap-3">
								<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
								<div>
									<p className="text-sm font-semibold text-red-800">Esta sessão NÃO foi salva no prontuário!</p>
									<p className="text-sm text-red-700 mt-1">
										Todos os dados serão perdidos permanentemente, incluindo:
									</p>
								</div>
							</div>
						</div>

						{/* Lista de dados que serão perdidos */}
						<div className="space-y-3">
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="w-2 h-2 bg-red-400 rounded-full" />
								<span>Transcrição completa da sessão</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="w-2 h-2 bg-red-400 rounded-full" />
								<span>Nota clínica gerada pela IA</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="w-2 h-2 bg-red-400 rounded-full" />
								<span>Todas as personalizações feitas</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="w-2 h-2 bg-red-400 rounded-full" />
								<span>Registro da sessão de {duration} minutos</span>
							</div>
						</div>

						{/* Pergunta de confirmação */}
						<div className="text-center py-2">
							<p className="text-lg font-semibold text-gray-900">
								Tem certeza que deseja continuar?
							</p>
						</div>
					</div>

					{/* Botões de ação */}
					<div className="px-8 py-6 bg-gray-50 flex gap-4">
						<button
							onClick={handleCancelDiscard}
							className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
						>
							Cancelar
						</button>
						<button
							onClick={handleConfirmDiscard}
							className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
						>
							Sim, descartar
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F4F3FF] px-4 py-10">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.22),transparent_60%)]"
			/>

			<div className="relative mx-auto flex max-w-6xl flex-col gap-8">
				<header className="rounded-3xl border border-white/70 bg-white/80 px-8 py-6 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-xl">
					<div className="flex flex-wrap items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<div className="relative">
								<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] text-white shadow-[0_18px_38px_-24px_rgba(79,70,229,0.65)]">
									<FileText className="h-7 w-7" aria-hidden="true" />
								</span>
								<div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
									<Check className="h-2.5 w-2.5 text-white" />
								</div>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
									Sessão finalizada
									<span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg">
										Processada
									</span>
								</h1>
								<p className="text-sm text-[#64748B] mt-1">Revise, personalize os detalhes gerados automaticamente e salve no prontuário.</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-3 text-sm text-[#1E293B]">
							<span className="inline-flex min-w-[160px] items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
								<User className="h-4 w-4 text-blue-600" aria-hidden="true" />
								<span className="font-semibold text-blue-900">{sessionData.patient_name}</span>
							</span>
							<span className="inline-flex min-w-[140px] items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 shadow-sm">
								<Calendar className="h-4 w-4 text-purple-600" aria-hidden="true" />
								<span className="font-medium text-purple-900">{date}</span>
							</span>
							<span className="inline-flex min-w-[140px] items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
								<TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden="true" />
								<span className="font-semibold text-emerald-900">{sessionData.duration_minutes} min</span>
							</span>
						</div>
					</div>
				</header>

				<main className="space-y-6 pb-32">
					<NoteAIDisclaimer show={showAIDisclaimer} />

					<div className="space-y-2">
						<SectionHeader id="resumo" icon={Activity} title="Resumo executivo" color="bg-gradient-to-r from-[#4F46E5] to-[#6366F1]" />
						{expandedSections.has("resumo") ? (
							<div className="space-y-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl animate-fade-in">
								<div className="rounded-2xl border border-[#E0E7FF] bg-[#EEF2FF] p-4">
									<div className="flex items-center gap-2 text-sm font-semibold text-[#4F46E5]">
										<AlertCircle className="h-4 w-4" aria-hidden="true" />
										Queixa principal
									</div>
									<textarea
										className="mt-3 w-full rounded-xl border border-[#C7D2FE] bg-white px-4 py-3 text-sm text-[#0F172A] transition-shadow focus:border-[#6366F1] focus:shadow-[0_12px_28px_-20px_rgba(79,70,229,0.55)] focus:outline-none"
										value={note.resumoExecutivo.queixaPrincipal}
										onChange={(event) =>
											setNote({
												...note,
												resumoExecutivo: { ...note.resumoExecutivo, queixaPrincipal: event.target.value }
											})
										}
										rows={3}
									/>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="rounded-2xl border border-[#FECACA] bg-gradient-to-br from-[#FEF2F2] to-[#FFEDD5] p-5 shadow-sm">
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DC2626] mb-3">Nível de dor (EVA)</p>
										<div className="space-y-3">
											<div className="flex items-end gap-2">
												<input
													type="number"
													min={0}
													max={10}
													className="w-20 border-none bg-transparent text-4xl font-bold text-[#DC2626] focus:outline-none"
													value={note.resumoExecutivo.nivelDor}
													onChange={(event) =>
														setNote({
															...note,
															resumoExecutivo: { ...note.resumoExecutivo, nivelDor: Number(event.target.value) }
														})
													}
												/>
												<span className="pb-1 text-2xl font-medium text-[#DC2626]">/10</span>
											</div>
											{/* Barra de progresso visual */}
											<div className="space-y-2">
												<div className="w-full bg-red-100 rounded-full h-2.5">
													<div 
														className="bg-gradient-to-r from-red-400 to-red-600 h-2.5 rounded-full transition-all duration-300 ease-out"
														style={{ width: `${(note.resumoExecutivo.nivelDor / 10) * 100}%` }}
													/>
												</div>
												<div className="flex justify-between text-xs text-red-500 font-medium">
													<span>Sem dor</span>
													<span>Dor severa</span>
												</div>
											</div>
										</div>
									</div>
									<div className="rounded-2xl border border-[#BBF7D0] bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] p-5 shadow-sm">
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#15803D] mb-3">Evolução do paciente</p>
										<div className="space-y-3">
											<div className="flex items-start gap-3">
												<div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
													<TrendingUp className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
												</div>
												<textarea
													className="flex-1 border-none bg-transparent text-sm font-medium text-[#166534] focus:outline-none resize-none placeholder-green-400"
													placeholder="Descreva a evolução observada na sessão..."
													value={note.resumoExecutivo.evolucao}
													onChange={(event) =>
														setNote({
															...note,
															resumoExecutivo: { ...note.resumoExecutivo, evolucao: event.target.value }
														})
													}
													rows={3}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						) : null}
					</div>

					<div className="space-y-2">
						<SectionHeader id="anamnese" icon={Clipboard} title="Anamnese" color="bg-purple-500" />
						{expandedSections.has("anamnese") ? (
							<div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
								<div>
									<p className="text-sm font-semibold text-[#0F172A]">Histórico atual</p>
									<textarea
										className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#8B5CF6] focus:outline-none"
										value={note.anamnese.historicoAtual}
										onChange={(event) =>
											setNote({
												...note,
												anamnese: { ...note.anamnese, historicoAtual: event.target.value }
											})
										}
										rows={4}
									/>
								</div>
								<div>
									<p className="text-sm font-semibold text-[#0F172A]">Antecedentes pessoais</p>
									<textarea
										className="mt-2 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#8B5CF6] focus:outline-none"
										value={note.anamnese.antecedentesPessoais}
										onChange={(event) =>
											setNote({
												...note,
												anamnese: { ...note.anamnese, antecedentesPessoais: event.target.value }
											})
										}
										rows={3}
									/>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-sm font-semibold text-[#0F172A]">Medicamentos</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#8B5CF6] focus:outline-none"
											value={note.anamnese.medicamentos}
											onChange={(event) =>
												setNote({
													...note,
													anamnese: { ...note.anamnese, medicamentos: event.target.value }
												})
											}
											rows={3}
										/>
									</div>
									<div>
										<p className="text-sm font-semibold text-[#0F172A]">Objetivos do paciente</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#8B5CF6] focus:outline-none"
											value={note.anamnese.objetivos}
											onChange={(event) =>
												setNote({
													...note,
													anamnese: { ...note.anamnese, objetivos: event.target.value }
												})
											}
											rows={3}
										/>
									</div>
								</div>
							</div>
						) : null}
					</div>

					<div className="space-y-2">
						<SectionHeader
							id="diagnostico"
							icon={Stethoscope}
							title="Diagnóstico fisioterapêutico"
							color="bg-blue-500"
						/>
						{expandedSections.has("diagnostico") ? (
							<div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
								<div>
									<p className="text-sm font-semibold text-[#0F172A]">Diagnóstico principal</p>
									<textarea
										className="mt-2 w-full rounded-xl border border-[#DBEAFE] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
										value={note.diagnosticoFisioterapeutico.principal}
										onChange={(event) =>
											setNote({
												...note,
												diagnosticoFisioterapeutico: {
													...note.diagnosticoFisioterapeutico,
													principal: event.target.value
												}
											})
										}
										rows={3}
									/>
								</div>
								<div>
									<p className="text-sm font-semibold text-[#0F172A]">Diagnósticos secundários (um por linha)</p>
									<textarea
										className="mt-2 w-full rounded-xl border border-[#DBEAFE] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
										value={note.diagnosticoFisioterapeutico.secundario.join("\n")}
										onChange={(event) =>
											setNote({
												...note,
												diagnosticoFisioterapeutico: {
													...note.diagnosticoFisioterapeutico,
													secundario: event.target.value.split("\n").filter(Boolean)
												}
											})
										}
										rows={4}
									/>
								</div>
								<div>
									<p className="text-sm font-semibold text-[#0F172A]">Código CIF</p>
									<input
										className="mt-2 w-full rounded-xl border border-[#DBEAFE] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
										value={note.diagnosticoFisioterapeutico.cif}
										onChange={(event) =>
											setNote({
												...note,
												diagnosticoFisioterapeutico: {
													...note.diagnosticoFisioterapeutico,
													cif: event.target.value
												}
											})
										}
									/>
								</div>
							</div>
						) : null}
					</div>

					<div className="space-y-2">
						<SectionHeader id="intervencoes" icon={Activity} title="Intervenções" color="bg-indigo-500" />
						{expandedSections.has("intervencoes") ? (
							<div className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
								{(
									[
										{
											label: "Técnicas manuais",
											value: note.intervencoes.tecnicasManuais,
											key: "tecnicasManuais"
										},
										{
											label: "Exercícios terapêuticos",
											value: note.intervencoes.exerciciosTerapeuticos,
											key: "exerciciosTerapeuticos"
										},
										{
											label: "Recursos eletrotermofototerapêuticos",
											value: note.intervencoes.recursosEletrotermofototerapeticos,
											key: "recursosEletrotermofototerapeticos"
										}
									] as const
								).map((section) => (
									<div key={section.key}>
										<p className="text-sm font-semibold text-[#0F172A]">{section.label} (um por linha)</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#6366F1] focus:outline-none"
											value={section.value.join("\n")}
											onChange={(event) =>
												setNote({
													...note,
													intervencoes: {
														...note.intervencoes,
														[section.key]: event.target.value.split("\n").filter(Boolean)
													}
												})
											}
											rows={4}
										/>
									</div>
								))}
							</div>
						) : null}
					</div>

					<div className="space-y-2">
						<SectionHeader id="resposta" icon={TrendingUp} title="Resposta ao tratamento" color="bg-emerald-500" />
						{expandedSections.has("resposta") ? (
							<div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
								{(
									[
										{ label: "Resposta imediata", key: "imediata" },
										{ label: "Efeitos observados", key: "efeitos" },
										{ label: "Feedback do paciente", key: "feedback" }
									] as const
								).map((field) => (
									<div key={field.key}>
										<p className="text-sm font-semibold text-[#0F172A]">{field.label}</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#34D399] focus:outline-none"
											value={note.respostaTratamento[field.key]}
											onChange={(event) =>
												setNote({
													...note,
													respostaTratamento: {
														...note.respostaTratamento,
														[field.key]: event.target.value
													}
												})
											}
											rows={field.key === "imediata" ? 4 : 3}
										/>
									</div>
								))}
							</div>
						) : null}
					</div>

					<div className="space-y-2">
						<SectionHeader id="orientacoes" icon={Clipboard} title="Orientações" color="bg-orange-500" />
						{expandedSections.has("orientacoes") ? (
							<div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
								{(
									[
										{ label: "Orientações domiciliares", key: "domiciliares", accent: "border-[#A5B4FC]" },
										{ label: "Orientações ergonômicas", key: "ergonomicas", accent: "border-[#FCD34D]" },
										{ label: "Precauções", key: "precaucoes", accent: "border-[#FDBA74]" }
									] as const
								).map((section) => (
									<div key={section.key} className={`rounded-2xl border ${section.accent} bg-white p-4`}>
										<p className="text-sm font-semibold text-[#0F172A]">{section.label}</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#fb923c] focus:outline-none"
											value={note.orientacoes[section.key].join("\n")}
											onChange={(event) =>
												setNote({
													...note,
													orientacoes: {
														...note.orientacoes,
														[section.key]: event.target.value.split("\n").filter(Boolean)
													}
												})
											}
											rows={4}
										/>
									</div>
								))}
							</div>
						) : null}
					</div>

					<div className="space-y-2">
						<SectionHeader id="plano" icon={Calendar} title="Planejamento" color="bg-sky-500" />
						{expandedSections.has("plano") ? (
							<div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-sm font-semibold text-[#0F172A]">Frequência</p>
										<input
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#38BDF8] focus:outline-none"
											value={note.planoTratamento.frequencia}
											onChange={(event) =>
												setNote({
													...note,
													planoTratamento: { ...note.planoTratamento, frequencia: event.target.value }
												})
											}
										/>
									</div>
									<div>
										<p className="text-sm font-semibold text-[#0F172A]">Duração prevista</p>
										<input
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#38BDF8] focus:outline-none"
											value={note.planoTratamento.duracaoPrevista}
											onChange={(event) =>
												setNote({
													...note,
													planoTratamento: { ...note.planoTratamento, duracaoPrevista: event.target.value }
												})
											}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-sm font-semibold text-[#0F172A]">Objetivos de curto prazo</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#38BDF8] focus:outline-none"
											value={note.planoTratamento.objetivosCurtoPrazo.join("\n")}
											onChange={(event) =>
												setNote({
													...note,
													planoTratamento: {
														...note.planoTratamento,
														objetivosCurtoPrazo: event.target.value.split("\n").filter(Boolean)
													}
												})
											}
											rows={4}
										/>
									</div>
									<div>
										<p className="text-sm font-semibold text-[#0F172A]">Objetivos de longo prazo</p>
										<textarea
											className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#38BDF8] focus:outline-none"
											value={note.planoTratamento.objetivosLongoPrazo.join("\n")}
											onChange={(event) =>
												setNote({
													...note,
													planoTratamento: {
														...note.planoTratamento,
														objetivosLongoPrazo: event.target.value.split("\n").filter(Boolean)
													}
												})
											}
											rows={4}
										/>
									</div>
								</div>
								<div>
									<p className="text-sm font-semibold text-[#0F172A]">Critérios de alta</p>
									<textarea
										className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] focus:border-[#38BDF8] focus:outline-none"
										value={note.planoTratamento.criteriosAlta.join("\n")}
										onChange={(event) =>
											setNote({
												...note,
												planoTratamento: {
													...note.planoTratamento,
													criteriosAlta: event.target.value.split("\n").filter(Boolean)
												}
											})
										}
										rows={4}
									/>
								</div>
								<div className="rounded-2xl border border-[#BAE6FD] bg-[#E0F2FE] p-4">
									<p className="text-sm font-semibold text-[#0369A1]">Próxima sessão</p>
									<div className="mt-3 grid gap-4 md:grid-cols-2">
										<div>
											<p className="text-xs uppercase tracking-[0.18em] text-[#0369A1]">Retorno</p>
											<input
												className="mt-2 w-full rounded-xl border border-[#BAE6FD] bg-white px-4 py-3 text-sm text-[#0F172A] focus:border-[#0EA5E9] focus:outline-none"
												value={note.proximaSessao.data}
												onChange={(event) =>
													setNote({
														...note,
														proximaSessao: { ...note.proximaSessao, data: event.target.value }
													})
												}
											/>
										</div>
										<div>
											<p className="text-xs uppercase tracking-[0.18em] text-[#0369A1]">Foco</p>
											<input
												className="mt-2 w-full rounded-xl border border-[#BAE6FD] bg-white px-4 py-3 text-sm text-[#0F172A] focus:border-[#0EA5E9] focus:outline-none"
												value={note.proximaSessao.foco}
												onChange={(event) =>
													setNote({
														...note,
														proximaSessao: { ...note.proximaSessao, foco: event.target.value }
													})
												}
											/>
										</div>
									</div>
								</div>
							</div>
						) : null}
					</div>

					{transcription.length > 0 ? (
						<div className="space-y-2">
							<SectionHeader
								id="transcricao"
								icon={FileText}
								title="Transcrição da sessão"
								color="bg-slate-600"
							/>
							{expandedSections.has("transcricao") ? (
								<div className="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.45)] animate-fade-in">
									{transcription.map((chunk, index) => (
										<p key={index} className="text-sm leading-relaxed text-[#1E293B]">
											{chunk}
										</p>
									))}
								</div>
							) : null}
						</div>
					) : null}
				</main>

				<div className="sticky bottom-6 mx-auto w-full max-w-6xl">
					{/* Barra de ações melhorada */}
					<div className="rounded-3xl border border-white/70 bg-white/95 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur-xl">
						{/* Header da barra com informações da sessão */}
						<div className="px-6 py-4 border-b border-gray-100">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
										<span className="text-sm font-medium text-gray-700">Sessão processada</span>
									</div>
									<span className="text-xs text-gray-500 font-mono">ID: {sessionData.id.slice(-8)}</span>
								</div>
								<div className="text-xs text-gray-500">
									{transcription.length > 0 ? `${transcription.length} segmentos transcritos` : 'Sem transcrição'}
								</div>
							</div>
						</div>

						{/* Botões de ação */}
						<div className="px-6 py-5">
							<div className="flex flex-wrap items-center justify-between gap-4">
								{/* Ações secundárias */}
								<div className="flex flex-wrap gap-3">
									<button
										onClick={handleCopyNote}
										className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
									>
										{copied ? (
											<>
												<Check className="h-4 w-4 text-green-600" aria-hidden="true" />
												<span className="text-green-700">Copiado!</span>
											</>
										) : (
											<>
												<Copy className="h-4 w-4" aria-hidden="true" />
												<span>Copiar nota</span>
											</>
										)}
									</button>
									<button className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5">
										<Download className="h-4 w-4" aria-hidden="true" />
										Exportar PDF
									</button>
								</div>

								{/* Ações primárias */}
								<div className="flex gap-3">
									<button
										onClick={handleClose}
										disabled={isSaving}
										className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Trash2 className="h-4 w-4" aria-hidden="true" />
										Descartar
									</button>
									<button
										onClick={handleSaveClick}
										disabled={isSaving}
										className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(34,197,94,0.55)] transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
									>
										{isSaving ? (
											<>
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
												Salvando no prontuário...
											</>
										) : (
											<>
												<Save className="h-4 w-4" aria-hidden="true" />
												Salvar no prontuário
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de descarte */}
			<DiscardModal />
		</div>
	);
};

export default SessionSummary;
