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
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-14T15:30:00Z',
    lastUpdated: '2024-01-15T09:00:00Z',
    description: 'Would it be possible to add dark mode to the application?',
    assignedTo: 'agent1@example.com',
  },
];

export default function AgentDashboard() {
  const { user } = useAuthStore();
  const [tickets] = useState<Ticket[]>(dummyTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleEscalate = (ticketId: string) => {
    console.log('Escalating ticket:', ticketId);
    // In a real app, this would make an API call to escalate the ticket
  };

  if (!user || user.role !== 'agent') {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p className="text-gray-500">Access denied. This page is only for support agents.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Agent Dashboard
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Assigned Tickets</h3>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="cursor-pointer"
            >
              <TicketCard
                ticket={ticket}
                showActions
                onEscalate={handleEscalate}
              />
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedTicket ? 'Ticket Conversation' : 'Select a ticket to view the conversation'}
          </h3>
          {selectedTicket ? (
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
                  content: 'Thank you for reaching out. I understand you\'re having issues with login. Could you please provide more details about when this started happening?',
                  sender: 'agent',
                  timestamp: selectedTicket.lastUpdated,
                },
              ]}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              Click on a ticket to view and respond to the conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}