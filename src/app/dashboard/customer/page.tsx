'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import TicketCard, { Ticket } from '@/components/TicketCard';
import ChatBox from '@/components/ChatBox';
import Link from 'next/link';

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
  },
  {
    id: '2',
    title: 'Feature request',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-14T15:30:00Z',
    lastUpdated: '2024-01-15T09:00:00Z',
    description: 'Would it be possible to add dark mode to the application?',
  },
];

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [tickets] = useState<Ticket[]>(dummyTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Support Tickets
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/tickets/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Ticket
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="cursor-pointer"
            >
              <TicketCard ticket={ticket} />
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
                  sender: 'ai',
                  timestamp: selectedTicket.lastUpdated,
                },
              ]}
              onClose={() => setSelectedTicket(null)}
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