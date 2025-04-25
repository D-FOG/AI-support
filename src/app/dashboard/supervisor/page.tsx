'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import TicketCard, { Ticket } from '@/components/TicketCard';
import ChatBox from '@/components/ChatBox';

// Dummy data for demonstration
const dummyTickets: Ticket[] = [
  {
    id: '1',
    title: 'Issue with login',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
    description: 'I cannot log in to my account. The page keeps refreshing.',
    assignedTo: 'agent1@example.com',
  },
  {
    id: '2',
    title: 'Feature request',
    status: 'escalated',
    priority: 'medium',
    createdAt: '2024-01-14T15:30:00Z',
    lastUpdated: '2024-01-15T09:00:00Z',
    description: 'Would it be possible to add dark mode to the application?',
  },
];

const dummyAgents = [
  { id: '1', email: 'agent1@example.com', name: 'John Doe', activeTickets: 3 },
  { id: '2', email: 'agent2@example.com', name: 'Jane Smith', activeTickets: 2 },
];

export default function SupervisorDashboard() {
  const { user } = useAuthStore();
  const [tickets] = useState<Ticket[]>(dummyTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleAssign = (ticketId: string) => {
    console.log('Assigning ticket:', ticketId);
    // In a real app, this would open a modal to select an agent
  };

  if (!user || user.role !== 'supervisor') {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p className="text-gray-500">Access denied. This page is only for supervisors.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Supervisor Dashboard
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Overview</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-600">Total Tickets</p>
                <p className="text-2xl font-bold text-indigo-900">{tickets.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Open</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Escalated</p>
                <p className="text-2xl font-bold text-red-900">
                  {tickets.filter(t => t.status === 'escalated').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Resolved</p>
                <p className="text-2xl font-bold text-green-900">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="cursor-pointer"
              >
                <TicketCard
                  ticket={ticket}
                  showActions
                  onAssign={handleAssign}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Overview</h3>
            <div className="space-y-4">
              {dummyAgents.map((agent) => (
                <div key={agent.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-900">{agent.name}</p>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                  <p className="text-sm text-indigo-600">
                    {agent.activeTickets} active tickets
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedTicket && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Conversation</h3>
              <ChatBox
                ticketId={selectedTicket.id}
                initialMessages={[
                  {
                    id: '1',
                    content: selectedTicket.description,
                    sender: 'user',
                    timestamp: selectedTicket.createdAt,
                  },
                  {
                    id: '2',
                    content: 'This ticket has been escalated for supervisor review.',
                    sender: 'agent',
                    timestamp: selectedTicket.lastUpdated,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}