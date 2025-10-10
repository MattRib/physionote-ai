'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar, LayoutGrid, List, Table as TableIcon, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  totalSessions: number;
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onDateFilter: (dateRange: string) => void;
  onViewModeChange: (mode: 'grid' | 'list' | 'table') => void;
  onItemsPerPageChange: (items: number) => void;
  currentViewMode: 'grid' | 'list' | 'table';
  currentItemsPerPage: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  totalSessions,
  onSearch,
  onStatusFilter,
  onDateFilter,
  onViewModeChange,
  onItemsPerPageChange,
  currentViewMode,
  currentItemsPerPage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    onDateFilter(range);
  };

  const statusOptions = [
    { value: 'all', label: 'Todas', count: totalSessions },
    { value: 'completed', label: 'Concluídas', icon: '✓' },
    { value: 'processing', label: 'Processando', icon: '⏳' },
    { value: 'error', label: 'Com Erro', icon: '⚠️' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Todo o período' },
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mês' },
    { value: 'custom', label: 'Período customizado' }
  ];

  const itemsPerPageOptions = [9, 15, 30, 50];

  return (
    <div className="space-y-4 mb-6">
      {/* Main Search and Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200
                     focus:border-[#5A9BCF] focus:outline-none
                     transition-colors duration-200
                     text-[#333333] placeholder:text-[#999999]"
          />
        </div>

        {/* Quick Filters Toggle */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 
                   transition-all duration-200 font-medium
                   ${isFiltersOpen 
                     ? 'border-[#5A9BCF] bg-[#5A9BCF] text-white' 
                     : 'border-gray-200 text-[#666666] hover:border-[#5A9BCF] hover:text-[#5A9BCF]'
                   }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              currentViewMode === 'grid'
                ? 'bg-white text-[#5A9BCF] shadow-sm'
                : 'text-[#666666] hover:text-[#5A9BCF]'
            }`}
            title="Modo Grid"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              currentViewMode === 'list'
                ? 'bg-white text-[#5A9BCF] shadow-sm'
                : 'text-[#666666] hover:text-[#5A9BCF]'
            }`}
            title="Modo Lista"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              currentViewMode === 'table'
                ? 'bg-white text-[#5A9BCF] shadow-sm'
                : 'text-[#666666] hover:text-[#5A9BCF]'
            }`}
            title="Modo Tabela"
          >
            <TableIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isFiltersOpen && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6 animate-fade-in">
          
          {/* Status Filter */}
          <div>
            <label className="text-sm font-semibold text-[#333333] mb-3 block">
              Status das Sessões
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200
                           text-left font-medium
                           ${selectedStatus === option.value
                             ? 'border-[#5A9BCF] bg-[#5A9BCF]/10 text-[#5A9BCF]'
                             : 'border-gray-200 text-[#666666] hover:border-[#5A9BCF]/50'
                           }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      {option.icon && <span>{option.icon}</span>}
                      <span>{option.label}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-sm font-semibold text-[#333333] mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Período</span>
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDateRangeChange(option.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200
                           text-center font-medium text-sm
                           ${selectedDateRange === option.value
                             ? 'border-[#5A9BCF] bg-[#5A9BCF]/10 text-[#5A9BCF]'
                             : 'border-gray-200 text-[#666666] hover:border-[#5A9BCF]/50'
                           }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Per Page */}
          <div>
            <label className="text-sm font-semibold text-[#333333] mb-3 block">
              Sessões por página
            </label>
            <div className="flex items-center space-x-3">
              {itemsPerPageOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => onItemsPerPageChange(count)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200
                           font-medium
                           ${currentItemsPerPage === count
                             ? 'border-[#5A9BCF] bg-[#5A9BCF] text-white'
                             : 'border-gray-200 text-[#666666] hover:border-[#5A9BCF]'
                           }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedDateRange('all');
                setSearchQuery('');
                onStatusFilter('all');
                onDateFilter('all');
                onSearch('');
              }}
              className="px-6 py-2 text-[#666666] hover:text-[#5A9BCF] 
                       font-medium transition-colors duration-200"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedStatus !== 'all' || selectedDateRange !== 'all' || searchQuery) && (
        <div className="flex items-center space-x-2 text-sm text-[#666666]">
          <span className="font-medium">Filtros ativos:</span>
          {selectedStatus !== 'all' && (
            <span className="px-3 py-1 bg-[#5A9BCF]/10 text-[#5A9BCF] rounded-full">
              {statusOptions.find(o => o.value === selectedStatus)?.label}
            </span>
          )}
          {selectedDateRange !== 'all' && (
            <span className="px-3 py-1 bg-[#5A9BCF]/10 text-[#5A9BCF] rounded-full">
              {dateRangeOptions.find(o => o.value === selectedDateRange)?.label}
            </span>
          )}
          {searchQuery && (
            <span className="px-3 py-1 bg-[#5A9BCF]/10 text-[#5A9BCF] rounded-full">
              &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
