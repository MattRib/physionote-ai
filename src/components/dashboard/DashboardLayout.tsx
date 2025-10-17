'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Menu, X, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import SessionCards from './SessionCards';
import SessionListView from './SessionListView';
import SessionTable from './SessionTable';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import NewSessionFlow from './NewSessionFlow';
import NoteViewModal from './NoteViewModal';
import { Modal } from '@/components/common';
import { DashboardSession } from './types';

type ViewMode = 'grid' | 'list' | 'table';

const DashboardLayout = () => {
  const router = useRouter();
  const [allSessions, setAllSessions] = useState<DashboardSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [noteModalData, setNoteModalData] = useState<{ id: string; patient_name: string; session_datetime: string; duration_minutes?: number } | null>(null);
  
  // Filter and view states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (dateFilter !== 'all') params.append('dateRange', dateFilter);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/sessions?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const data = await response.json();
        setAllSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setAllSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [statusFilter, dateFilter, searchQuery]);

  // Filter logic - now done on server side, but kept for compatibility
  const filteredSessions = useMemo(() => {
    return allSessions;
  }, [allSessions]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSessions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSessions, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, itemsPerPage]);

  const handleNewSession = () => {
    router.push('/dashboard/new-session');
  };

  const handleCloseModal = () => {
    setIsNewSessionModalOpen(false);
  };

  const handleSessionCreated = () => {
    // Refresh sessions list after creating a new one
    setIsNewSessionModalOpen(false);
    // Trigger re-fetch by changing a state that useEffect depends on
    setStatusFilter(statusFilter); // This will trigger the useEffect
  };

  const handleViewNote = (sessionData: { id: string; patient_name: string; session_datetime: string; duration_minutes?: number }) => {
    setNoteModalData(sessionData);
  };

  const handleCloseNoteModal = () => {
    setNoteModalData(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleDateFilter = (range: string) => {
    setDateFilter(range);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      
      {/* Sidebar - Desktop (Always Visible) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen w-72 bg-white shadow-lg z-50
        transform transition-transform duration-300 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        
        {/* Top Bar - Mobile Menu Button */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-[#0F172A]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0F172A]" />
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-lg flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#0F172A]">PhysioNote.AI</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="px-6 py-8 pt-20 lg:pt-8">
          <div className="mx-auto max-w-7xl space-y-8">
          
            {/* Header Section */}
            <div className="rounded-[32px] border border-white/60 bg-white/70 px-8 py-7 shadow-[0_25px_30px_-40px_rgba(79,70,229,0.45)] backdrop-blur-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
                    Dashboard
                  </span>
                  <h1 className="mt-4 text-3xl font-bold text-[#0F172A] lg:text-4xl">
                    Minhas Sessões
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-[#64748B]">
                    {filteredSessions.length} {filteredSessions.length === 1 ? 'sessão encontrada' : 'sessões encontradas'}
                    {filteredSessions.length !== allSessions.length && (
                      <span className="font-semibold text-[#4F46E5]"> (filtrado de {allSessions.length})</span>
                    )}
                  </p>
                </div>

                {/* New Session CTA */}
                <button
                  onClick={handleNewSession}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span>Nova Sessão</span>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Concluídas</p>
                    <p className="mt-3 text-3xl font-semibold text-[#16A34A]">
                      {allSessions.filter(s => s.status === 'completed').length}
                    </p>
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
                    <p className="mt-3 text-3xl font-semibold text-[#B45309]">
                      {allSessions.filter(s => s.status === 'processing').length}
                    </p>
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
                    <p className="mt-3 text-3xl font-semibold text-[#DC2626]">
                      {allSessions.filter(s => s.status === 'error').length}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2] text-2xl">
                    ⚠️
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              totalSessions={allSessions.length}
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              onDateFilter={handleDateFilter}
              onViewModeChange={handleViewModeChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              currentViewMode={viewMode}
              currentItemsPerPage={itemsPerPage}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4F46E5] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-sm font-medium text-[#64748B]">Carregando sessões...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredSessions.length === 0 && (
              <div className="rounded-[26px] border border-white/70 bg-white/95 px-8 py-16 text-center shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <Activity className="h-10 w-10 text-[#4F46E5]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#0F172A]">
                  Nenhuma sessão encontrada
                </h3>
                <p className="mb-6 text-sm text-[#64748B]">
                  {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Tente ajustar os filtros ou criar uma nova sessão.'
                    : 'Comece criando sua primeira sessão de atendimento.'}
                </p>
                <button
                  onClick={handleNewSession}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span>Criar Primeira Sessão</span>
                </button>
              </div>
            )}

            {/* Sessions Display */}
            {!isLoading && filteredSessions.length > 0 && (
              <>
                {viewMode === 'grid' && <SessionCards sessions={paginatedSessions} onViewNote={handleViewNote} />}
                {viewMode === 'list' && <SessionListView sessions={paginatedSessions} />}
                {viewMode === 'table' && <SessionTable sessions={paginatedSessions} />}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredSessions.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* New Session Modal */}
      <Modal
        isOpen={isNewSessionModalOpen}
        onClose={handleCloseModal}
        title="Nova Sessão de Atendimento"
        size="lg"
      >
        <NewSessionFlow onSuccess={handleSessionCreated} onCancel={handleCloseModal} />
      </Modal>

      {/* Note View Modal */}
      {noteModalData && (
        <NoteViewModal
          isOpen={true}
          onClose={handleCloseNoteModal}
          sessionData={noteModalData}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
