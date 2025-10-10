'use client';

import React, { useState, useMemo } from 'react';
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

// Mock data expandido - substituir com dados reais da API
const generateMockSessions = () => {
  const names = [
    'Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Carla Mendes',
    'Lucas Ferreira', 'Juliana Souza', 'Roberto Alves', 'Patricia Lima', 'Fernando Dias',
    'Amanda Rodrigues', 'Ricardo Martins', 'Beatriz Campos', 'Gustavo Pereira', 'Mariana Rocha',
    'Carlos Eduardo', 'Fernanda Gomes', 'Rafael Barbosa', 'Camila Santos', 'Bruno Costa'
  ];

  const statuses: Array<'completed' | 'processing' | 'error'> = ['completed', 'processing', 'error'];
  const sessions = [];

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(i / 3);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(9 + (i % 8), (i * 15) % 60, 0, 0);

    sessions.push({
      id: `session-${i + 1}`,
      session_datetime: date.toISOString(),
      patient_name: names[i % names.length],
      status: i === 1 ? 'processing' : i === 3 ? 'error' : statuses[Math.floor(Math.random() * statuses.length)],
      is_anonymized: true,
      duration_minutes: 20 + (i % 4) * 15
    });
  }

  return sessions;
};

type ViewMode = 'grid' | 'list' | 'table';

const DashboardLayout = () => {
  const router = useRouter();
  const [allSessions] = useState(generateMockSessions());
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

  // Filter logic
  const filteredSessions = useMemo(() => {
    let filtered = [...allSessions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.session_datetime);
        const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

        switch (dateFilter) {
          case 'today':
            return sessionDay.getTime() === today.getTime();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return sessionDay.getTime() === yesterday.getTime();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDay >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return sessionDay >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allSessions, searchQuery, statusFilter, dateFilter]);

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
    router.push('/dashboard/session');
  };

  const handleCloseModal = () => {
    setIsNewSessionModalOpen(false);
  };

  const handleSessionCreated = () => {
    // TODO: Adicionar nova sessão à lista
    // TODO: Mostrar toast de sucesso
    setIsNewSessionModalOpen(false);
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
        fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        
        {/* Top Bar - Mobile Menu Button */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-[#333333]" />
            ) : (
              <Menu className="w-6 h-6 text-[#333333]" />
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#5A9BCF] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#333333]">PhysioNote.AI</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          
          {/* Header Section */}
          <div className="mb-8 space-y-6">
            
            {/* Title and CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-[#333333]">
                  Minhas Sessões
                </h1>
                <p className="text-[#666666]">
                  {filteredSessions.length} {filteredSessions.length === 1 ? 'sessão encontrada' : 'sessões encontradas'}
                  {filteredSessions.length !== allSessions.length && (
                    <span className="text-[#5A9BCF]"> (filtrado de {allSessions.length})</span>
                  )}
                </p>
              </div>

              {/* New Session CTA */}
              <button
                onClick={handleNewSession}
                className="flex items-center justify-center space-x-2
                         px-6 py-3 text-white rounded-lg
                         font-semibold
                         btn-gradient-animated
                         hover:scale-105
                         transition-transform duration-300
                         shadow-lg
                         group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Nova Sessão</span>
              </button>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center flex-wrap gap-4 text-sm">
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-[#666666]">Concluídas: </span>
                <span className="font-bold text-green-600">
                  {allSessions.filter(s => s.status === 'completed').length}
                </span>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-[#666666]">Processando: </span>
                <span className="font-bold text-amber-600">
                  {allSessions.filter(s => s.status === 'processing').length}
                </span>
              </div>
              {allSessions.filter(s => s.status === 'error').length > 0 && (
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                  <span className="text-[#666666]">Com Erro: </span>
                  <span className="font-bold text-red-600">
                    {allSessions.filter(s => s.status === 'error').length}
                  </span>
                </div>
              )}
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

          {/* Sessions Display */}
          {viewMode === 'grid' && <SessionCards sessions={paginatedSessions} onViewNote={handleViewNote} />}
          {viewMode === 'list' && <SessionListView sessions={paginatedSessions} />}
          {viewMode === 'table' && <SessionTable sessions={paginatedSessions} />}

          {/* Pagination */}
          {filteredSessions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSessions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
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
