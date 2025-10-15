'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Download,
	FileText,
	Filter,
	Grid3x3,
	List,
	Plus,
	Search,
	Shield,
	Table2
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
	const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');

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

		return {
			total,
			completed,
			processing,
			error
		};
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
		<div className="min-h-screen px-6 py-8">
			<div className="mx-auto max-w-7xl space-y-8">
				{/* Header Section */}
				<div className="rounded-[32px] border border-white/60 bg-white/70 px-8 py-7 shadow-[0_25px_60px_-40px_rgba(79,70,229,0.45)] backdrop-blur-sm">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<span className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
								Histórico de Atendimentos
							</span>
							<h1 className="mt-4 text-3xl font-bold text-[#0F172A] lg:text-4xl">Minhas Sessões</h1>
							<p className="mt-2 max-w-xl text-sm text-[#64748B]">
								Visualize rapidamente a evolução dos atendimentos, monitore o status de processamento e acesse notas clínicas com um só clique.
							</p>
						</div>
						<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
							<div className="rounded-2xl border border-[#E0E7FF] bg-white/90 px-5 py-3 text-center shadow-inner">
								<p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">Total de sessões</p>
								<p className="text-2xl font-semibold text-[#4F46E5]">{metrics.total}</p>
							</div>
							<button
								onClick={handleNewSession}
								className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-transform hover:-translate-y-0.5"
							>
								<Plus className="h-5 w-5" />
								Nova Sessão
							</button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
					<div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Concluídas</p>
								<p className="mt-3 text-3xl font-semibold text-[#16A34A]">{metrics.completed}</p>
							</div>
							<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7] text-2xl">
								✓
							</div>
						</div>
					</div>
					<div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(234,179,8,0.35)]">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Processando</p>
								<p className="mt-3 text-3xl font-semibold text-[#B45309]">{metrics.processing}</p>
							</div>
							<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF3C7] text-2xl">
								⏱️
							</div>
						</div>
					</div>
					<div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(239,68,68,0.35)]">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Com erro</p>
								<p className="mt-3 text-3xl font-semibold text-[#DC2626]">{metrics.error}</p>
							</div>
							<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2] text-2xl">
								⚠️
							</div>
						</div>
					</div>
				</div>

				{/* Status Legend */}
				<div className="rounded-[20px] border border-white/70 bg-white/95 px-6 py-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.25)]">
					<div className="flex flex-wrap items-center gap-6">
						<span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Legenda:</span>
						<div className="flex flex-wrap gap-5">
							<div className="flex items-center gap-2">
								<div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#16A34A]"></div>
								<span className="text-xs font-medium text-[#475569]">Concluída</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#B45309]"></div>
								<span className="text-xs font-medium text-[#475569]">Em processamento</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#DC2626]"></div>
								<span className="text-xs font-medium text-[#475569]">Erro no processamento</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="h-3.5 w-3.5 text-[#047857]" />
								<span className="text-xs font-medium text-[#475569]">Dados anonimizados (LGPD)</span>
							</div>
						</div>
					</div>
				</div>

				{/* Search and View Toggle */}
				<div className="flex flex-col gap-4 rounded-[26px] border border-white/70 bg-white/95 p-5 shadow-[0_18px_45px_-38px_rgba(79,70,229,0.35)] sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
						<input
							type="search"
							placeholder="Buscar por paciente..."
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							className="w-full rounded-2xl border border-transparent bg-white/90 pl-12 pr-4 py-3 text-sm font-medium text-[#0F172A] shadow-inner focus:border-[#C7D2FE] focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]"
						/>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] px-5 py-3 text-sm font-semibold text-[#475569] transition-colors hover:border-[#C7D2FE] hover:bg-[#EEF2FF]"
						>
							<Filter className="h-5 w-5" />
							Filtros
						</button>
						
						{/* View Mode Toggle */}
						<div className="flex items-center gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-1">
							<button
								onClick={() => setViewMode('grid')}
								className={`rounded-xl p-2 transition-all ${
									viewMode === 'grid' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
								}`}
								title="Visualização em grade"
							>
								<Grid3x3 className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={`rounded-xl p-2 transition-all ${
									viewMode === 'list' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
								}`}
								title="Visualização em lista"
							>
								<List className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode('table')}
								className={`rounded-xl p-2 transition-all ${
									viewMode === 'table' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
								}`}
								title="Visualização em tabela"
							>
								<Table2 className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Sessions Table/List */}
				<div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/95 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
					{viewMode === 'table' && (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-[#EEF2FF]/30">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
											Data/Hora
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
											Paciente
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
											Duração
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
											Status
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
											LGPD
										</th>
										<th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#E2E8F0]">
									{filteredSessions.length === 0 ? (
										<tr>
											<td colSpan={6} className="px-6 py-12 text-center text-sm text-[#64748B]">
												Nenhuma sessão encontrada.
											</td>
										</tr>
									) : (
										filteredSessions.map((session) => {
											const { date, time } = formatDateTime(session.session_datetime);
											return (
												<tr key={session.id} className="transition-colors hover:bg-[#F8FAFC]">
													<td className="px-6 py-4 text-sm">
														<div className="font-semibold text-[#0F172A]">{date}</div>
														<div className="text-xs text-[#94A3B8]">{time}</div>
													</td>
													<td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">
														{session.patient_name}
													</td>
													<td className="px-6 py-4 text-sm font-medium text-[#475569]">
														{session.duration_minutes > 0 ? `${session.duration_minutes} min` : '–'}
													</td>
													<td className="px-6 py-4">{getStatusBadge(session.status)}</td>
													<td className="px-6 py-4">
														{session.is_anonymized ? (
															<div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#047857]">
																<Shield className="h-4 w-4" />
																Sim
															</div>
														) : (
															<div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
																<Shield className="h-4 w-4" />
																Não
															</div>
														)}
													</td>
													<td className="px-6 py-4 text-right">
														<div className="flex items-center justify-end gap-2">
															<button
																onClick={() => handleViewNote(session.id)}
																disabled={session.status !== 'completed'}
																className="rounded-xl p-2 text-[#6366F1] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
																title="Ver nota"
															>
																<FileText className="h-4 w-4" />
															</button>
															<button
																onClick={() => handleExport(session.id)}
																disabled={session.status !== 'completed'}
																className="rounded-xl p-2 text-[#6366F1] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
																title="Exportar"
															>
																<Download className="h-4 w-4" />
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
					)}

					{viewMode === 'list' && (
						<div className="divide-y divide-[#E2E8F0]">
							{filteredSessions.length === 0 ? (
								<div className="px-6 py-12 text-center text-sm text-[#64748B]">
									Nenhuma sessão encontrada.
								</div>
							) : (
								filteredSessions.map((session) => {
									const { date, time } = formatDateTime(session.session_datetime);
									return (
										<div key={session.id} className="p-6 transition-colors hover:bg-[#F8FAFC]">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h3 className="text-base font-semibold text-[#0F172A]">
														{session.patient_name}
													</h3>
													<p className="mt-1 text-sm font-medium text-[#64748B]">
														{date} às {time}
													</p>
													<div className="mt-3 flex items-center gap-3">
														{getStatusBadge(session.status)}
														{session.is_anonymized && (
															<div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#047857]">
																<Shield className="h-4 w-4" />
																LGPD
															</div>
														)}
														{session.duration_minutes > 0 && (
															<span className="text-xs font-medium text-[#64748B]">
																{session.duration_minutes} min
															</span>
														)}
													</div>
												</div>
												<div className="flex items-center gap-2">
													<button
														onClick={() => handleViewNote(session.id)}
														disabled={session.status !== 'completed'}
														className="rounded-xl p-2 text-[#6366F1] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
														title="Ver nota"
													>
														<FileText className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleExport(session.id)}
														disabled={session.status !== 'completed'}
														className="rounded-xl p-2 text-[#6366F1] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
														title="Exportar"
													>
														<Download className="h-4 w-4" />
													</button>
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>
					)}

					{viewMode === 'grid' && (
						<div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
							{filteredSessions.length === 0 ? (
								<div className="col-span-full py-12 text-center text-sm text-[#64748B]">
									Nenhuma sessão encontrada.
								</div>
							) : (
								filteredSessions.map((session) => {
									const { date, time } = formatDateTime(session.session_datetime);
									return (
										<div
											key={session.id}
											className="rounded-[20px] border border-white/70 bg-white/95 p-5 shadow-[0_15px_35px_-28px_rgba(15,23,42,0.3)] transition-all hover:shadow-[0_20px_45px_-20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5"
										>
											<div className="mb-4 flex items-start justify-between">
												<h3 className="text-sm font-semibold text-[#0F172A]">
													{session.patient_name}
												</h3>
												{getStatusBadge(session.status)}
											</div>
											<p className="text-xs font-medium text-[#94A3B8]">
												{date} às {time}
											</p>
											<div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
												<div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
													{session.is_anonymized && (
														<Shield className="h-3.5 w-3.5 text-[#047857]" />
													)}
													{session.duration_minutes > 0 && (
														<span>{session.duration_minutes} min</span>
													)}
												</div>
												<div className="flex items-center gap-1">
													<button
														onClick={() => handleViewNote(session.id)}
														disabled={session.status !== 'completed'}
														className="rounded-lg p-1.5 text-[#6366F1] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
														title="Ver nota"
													>
														<FileText className="h-4 w-4" />
													</button>
													<button
														onClick={() => handleExport(session.id)}
														disabled={session.status !== 'completed'}
														className="rounded-lg p-1.5 text-[#6366F1] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
														title="Exportar"
													>
														<Download className="h-4 w-4" />
													</button>
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SessionList;
