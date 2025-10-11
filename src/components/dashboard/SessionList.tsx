'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	ArrowUpRight,
	CalendarRange,
	Download,
	FileText,
	Filter,
	Plus,
	Search,
	Shield,
	Sparkles,
	Timer
} from 'lucide-react';

interface Session {
	id: string;
	session_datetime: string;
	patient_name: string;
	status: 'completed' | 'processing' | 'error';
	is_anonymized: boolean;
	duration_minutes: number;
}

const mockSessions: Session[] = [
	{
		id: '1',
		session_datetime: '2025-10-08T10:30:00',
		patient_name: 'Maria Silva',
		status: 'completed',
		is_anonymized: true,
		duration_minutes: 45
	},
	{
		id: '2',
		session_datetime: '2025-10-08T14:00:00',
		patient_name: 'João Santos',
		status: 'processing',
		is_anonymized: true,
		duration_minutes: 60
	},
	{
		id: '3',
		session_datetime: '2025-10-07T09:15:00',
		patient_name: 'Ana Rodrigues',
		status: 'completed',
		is_anonymized: true,
		duration_minutes: 30
	},
	{
		id: '4',
		session_datetime: '2025-10-07T11:30:00',
		patient_name: 'Carlos Oliveira',
		status: 'error',
		is_anonymized: false,
		duration_minutes: 0
	},
	{
		id: '5',
		session_datetime: '2025-10-06T16:00:00',
		patient_name: 'Beatriz Lima',
		status: 'completed',
		is_anonymized: true,
		duration_minutes: 50
	}
];

const SessionList = () => {
	const router = useRouter();
	const [sessions] = useState<Session[]>(mockSessions);
	const [statusFilter, setStatusFilter] = useState<'all' | Session['status']>('all');
	const [searchTerm, setSearchTerm] = useState('');

	const filteredSessions = useMemo(() => {
		let list = sessions;
		if (statusFilter !== 'all') {
			list = list.filter((session) => session.status === statusFilter);
		}
		if (searchTerm.trim()) {
			const normalized = searchTerm.trim().toLowerCase();
			list = list.filter((session) => session.patient_name.toLowerCase().includes(normalized));
		}
		return list;
	}, [sessions, statusFilter, searchTerm]);

	const metrics = useMemo(() => {
		const total = sessions.length;
		const completed = sessions.filter((session) => session.status === 'completed').length;
		const processing = sessions.filter((session) => session.status === 'processing').length;
		const error = sessions.filter((session) => session.status === 'error').length;
		const latest = sessions
			.slice()
			.sort((a, b) => new Date(b.session_datetime).getTime() - new Date(a.session_datetime).getTime())[0];

		return {
			total,
			completed,
			processing,
			error,
			latest
		};
	}, [sessions]);

	const statusOptions = useMemo(
		() => [
			{ value: 'all' as const, label: 'Todas', count: metrics.total },
			{ value: 'completed' as const, label: 'Concluídas', count: metrics.completed },
			{ value: 'processing' as const, label: 'Processando', count: metrics.processing },
			{ value: 'error' as const, label: 'Com erro', count: metrics.error }
		],
		[metrics]
	);

	const averageDuration = useMemo(() => {
		if (sessions.length === 0) return 0;
		const totalMinutes = sessions.reduce((sum, session) => sum + session.duration_minutes, 0);
		return Math.round(totalMinutes / sessions.length);
	}, [sessions]);

	const handleNewSession = () => {
		router.push('/dashboard/new-session');
	};

	const handleViewNote = (sessionId: string) => {
		console.log('Ver nota', sessionId);
	};

	const handleExport = (sessionId: string) => {
		console.log('Exportar', sessionId);
	};

	const formatDateTime = (datetime: string) => {
		const date = new Date(datetime);
		return {
			date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
			time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
		};
	};

	const getStatusBadge = (status: Session['status']) => {
		const badgeMap = {
			completed: {
				className: 'bg-[#DCFCE7] text-[#047857]',
				label: 'Concluída'
			},
			processing: {
				className: 'bg-[#FEF3C7] text-[#B45309]',
				label: 'Processando'
			},
			error: {
				className: 'bg-[#FEE2E2] text-[#B91C1C]',
				label: 'Erro'
			}
		} as const;

		const badge = badgeMap[status];

		return (
			<span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
				<span className="h-2 w-2 rounded-full bg-current" />
				{badge.label}
			</span>
		);
	};

	return (
		<div className="relative min-h-screen flex-1 bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFF] to-white">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_55%)]"
			/>

			<div className="relative mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
				<div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_30px_60px_-45px_rgba(79,70,229,0.6)] backdrop-blur">
					<div
						aria-hidden="true"
						className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-[#4F46E5]/30 to-[#818CF8]/10"
					/>
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white shadow-[0_18px_38px_-20px_rgba(79,70,229,0.7)]">
								<Sparkles className="h-6 w-6" />
							</div>
							<div className="space-y-2">
								<p className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#4F46E5]">
									Histórico inteligente
									<ArrowUpRight className="h-4 w-4" />
								</p>
								<h1 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">Minhas Sessões</h1>
								<p className="max-w-2xl text-sm text-[#475569]">
									Visualize rapidamente a evolução dos atendimentos, monitore o status de processamento e acesse notas clínicas com um só clique.
								</p>
							</div>
						</div>
						<button
							onClick={handleNewSession}
							className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-transform hover:-translate-y-0.5"
						>
							<Plus className="h-5 w-5" />
							Nova sessão
						</button>
					</div>

					{metrics.latest && (
						<div className="mt-8 grid gap-4 md:grid-cols-2">
							<div className="rounded-3xl border border-[#C7D2FE]/70 bg-[#EEF2FF]/70 p-6">
								<div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">
									Próxima análise
									<CalendarRange className="h-4 w-4" />
								</div>
								<div className="mt-3 text-lg font-semibold text-[#0F172A]">
									{metrics.latest.patient_name}
								</div>
								<p className="text-sm text-[#475569]">
									{formatDateTime(metrics.latest.session_datetime).date} às {formatDateTime(metrics.latest.session_datetime).time}
								</p>
							</div>
							<div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-inner">
								<div className="flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#047857]">
										<Timer className="h-6 w-6" />
									</div>
									<div>
										<div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Tempo médio</div>
										<div className="mt-1 text-lg font-semibold text-[#0F172A]">
											{averageDuration ? `${averageDuration} min` : '—'}
										</div>
										<p className="text-xs text-[#64748B]">Baseado nas últimas {sessions.length} sessões registradas</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_38px_-24px_rgba(79,70,229,0.35)]">
						<div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Total</div>
						<div className="mt-3 flex items-baseline gap-2 text-3xl font-bold text-[#0F172A]">
							{metrics.total}
							<span className="text-sm font-medium text-[#94A3B8]">sessões</span>
						</div>
					</div>
					<div className="rounded-3xl border border-[#BBF7D0] bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] p-6 text-[#065F46] shadow-[0_18px_38px_-26px_rgba(16,185,129,0.45)]">
						<div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">Concluídas</div>
						<div className="mt-3 text-3xl font-bold">{metrics.completed}</div>
						<p className="text-xs font-medium text-[#047857]/80">Notas geradas com sucesso</p>
					</div>
					<div className="rounded-3xl border border-[#FDE68A] bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-6 text-[#92400E] shadow-[0_18px_38px_-26px_rgba(234,179,8,0.45)]">
						<div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B45309]">Processando</div>
						<div className="mt-3 text-3xl font-bold">{metrics.processing}</div>
						<p className="text-xs font-medium text-[#B45309]/80">Preparando transcrição</p>
					</div>
					<div className="rounded-3xl border border-[#FECACA] bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] p-6 text-[#7F1D1D] shadow-[0_18px_38px_-26px_rgba(248,113,113,0.45)]">
						<div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B91C1C]">Com atenção</div>
						<div className="mt-3 text-3xl font-bold">{metrics.error}</div>
						<p className="text-xs font-medium text-[#B91C1C]/80">Necessitam revisão manual</p>
					</div>
				</div>

				<div className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.45)] backdrop-blur">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="relative w-full md:max-w-md">
							<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
							<input
								type="search"
								placeholder="Buscar por paciente..."
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								className="w-full rounded-full border border-[#E2E8F0] bg-white/80 py-3 pl-12 pr-4 text-sm text-[#0F172A] shadow-inner placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]"
							/>
						</div>
						<button
							type="button"
							className="inline-flex items-center gap-2 self-start rounded-full border border-[#E2E8F0] bg-white/70 px-4 py-2 text-sm font-semibold text-[#475569] shadow-sm transition-colors hover:border-[#C7D2FE] hover:text-[#4F46E5]"
						>
							<Filter className="h-4 w-4" />
							Filtros avançados (em breve)
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{statusOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => setStatusFilter(option.value)}
								className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
									statusFilter === option.value
										? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-[0_12px_24px_-18px_rgba(79,70,229,0.6)]'
										: 'border-transparent bg-[#F8FAFC] text-[#475569] hover:border-[#E2E8F0] hover:bg-white'
								}`}
							>
								<span>{option.label}</span>
								<span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-[#4F46E5]">
									{option.count}
								</span>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<div className="hidden overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_30px_60px_-48px_rgba(15,23,42,0.45)] lg:block">
						<table className="w-full">
							<thead className="bg-[#F8FAFF]/80 text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
								<tr>
									<th className="px-6 py-4 text-left">Data/Hora</th>
									<th className="px-6 py-4 text-left">Paciente</th>
									<th className="px-6 py-4 text-left">Duração</th>
									<th className="px-6 py-4 text-left">Status</th>
									<th className="px-6 py-4 text-left">Conformidade</th>
									<th className="px-6 py-4 text-right">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#E2E8F0]/70">
								{filteredSessions.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-16 text-center text-sm text-[#64748B]">
											Nenhuma sessão encontrada com os filtros selecionados.
										</td>
									</tr>
								) : (
									filteredSessions.map((session, index) => {
										const { date, time } = formatDateTime(session.session_datetime);
										const isFirst = index === 0;
										return (
											<tr
												key={session.id}
												className={`transition-all duration-150 hover:bg-[#EEF2FF]/40 ${
													isFirst ? 'bg-[#EEF2FF]/35' : 'bg-transparent'
												}`}
											>
												<td className="px-6 py-5 text-sm">
													<div className="font-medium text-[#0F172A]">{date}</div>
													<div className="text-xs text-[#64748B]">{time}</div>
												</td>
												<td className="px-6 py-5 text-sm font-semibold text-[#0F172A]">{session.patient_name}</td>
												<td className="px-6 py-5 text-sm text-[#475569]">
													{session.duration_minutes > 0 ? `${session.duration_minutes} min` : '–'}
												</td>
												<td className="px-6 py-5">{getStatusBadge(session.status)}</td>
												<td className="px-6 py-5">
													{session.is_anonymized ? (
														<div className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#047857]">
															<Shield className="h-4 w-4" />
															LGPD
														</div>
													) : (
														<div className="inline-flex items-center gap-2 rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
															<Shield className="h-4 w-4" />
															Pendente
														</div>
													)}
												</td>
												<td className="px-6 py-5 text-right">
													<div className="flex items-center justify-end gap-2">
														<button
															onClick={() => handleViewNote(session.id)}
															disabled={session.status !== 'completed'}
															className="rounded-full p-2 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5F5]"
															title="Ver nota"
														>
															<FileText className="h-5 w-5" />
														</button>
														<button
															onClick={() => handleExport(session.id)}
															disabled={session.status !== 'completed'}
															className="rounded-full p-2 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5F5]"
															title="Exportar"
														>
															<Download className="h-5 w-5" />
														</button>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>

					<div className="space-y-4 lg:hidden">
						{filteredSessions.length === 0 ? (
							<div className="rounded-3xl border border-dashed border-[#C7D2FE] bg-[#EEF2FF]/60 p-8 text-center text-sm text-[#4F46E5]">
								Ajuste os filtros para visualizar sessões aqui.
							</div>
						) : (
							filteredSessions.map((session) => {
								const { date, time } = formatDateTime(session.session_datetime);
								return (
									<div
										key={session.id}
										className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_50px_-42px_rgba(15,23,42,0.55)] backdrop-blur"
									>
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-[#0F172A]">{session.patient_name}</h3>
												<p className="mt-1 text-sm text-[#64748B]">
													{date} às {time}
												</p>
											</div>
											{getStatusBadge(session.status)}
										</div>
										<div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0]/70 pt-4">
											<div className="flex items-center gap-3 text-xs font-medium text-[#64748B]">
												{session.is_anonymized ? (
													<span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-[#047857]">
														<Shield className="h-4 w-4" />
														LGPD
													</span>
												) : (
													<span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-3 py-1 text-[#475569]">
														<Shield className="h-4 w-4" />
														Pendente
													</span>
												)}
												{session.duration_minutes > 0 && <span>{session.duration_minutes} min</span>}
											</div>
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleViewNote(session.id)}
													disabled={session.status !== 'completed'}
													className="rounded-full p-2 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5F5]"
												>
													<FileText className="h-5 w-5" />
												</button>
												<button
													onClick={() => handleExport(session.id)}
													disabled={session.status !== 'completed'}
													className="rounded-full p-2 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5F5]"
												>
													<Download className="h-5 w-5" />
												</button>
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionList;
