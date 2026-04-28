import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Send, Clock, User as UserIcon } from 'lucide-react';
import API_BASE_URL from '../config';

const SupportSystem = ({ isAdmin = false }) => {
  const [tickets, setTickets] = useState([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'Medium' });
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      // Root endpoint handles both user-specific and admin-all tickets based on token role
      const url = `${API_BASE_URL}/api/support/tickets`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) { 
      console.error(err); 
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/support/tickets`, newTicket, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowNewTicket(false);
      fetchTickets();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/support/tickets/${selectedTicket._id}/message`, { text: reply }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReply('');
      fetchTickets();
      // Update selected ticket view
      const updated = await axios.get(`${API_BASE_URL}/api/support/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(updated.data.data.find(t => t._id === selectedTicket._id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Ticket List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">{isAdmin ? 'Support Hub' : 'My Tickets'}</h3>
          {!isAdmin && (
            <button 
              onClick={() => setShowNewTicket(true)}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button 
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedTicket?._id === ticket._id 
                ? 'border-primary-600 bg-primary-50 shadow-md' 
                : 'border-white bg-white hover:border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-slate-800 line-clamp-1">{ticket.subject}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3 truncate">{ticket.description}</p>
              <div className="flex items-center text-[10px] text-slate-400 font-medium">
                <Clock size={12} className="mr-1" />
                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'New'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Detail / New Ticket Form */}
      <div className="lg:col-span-2">
        {showNewTicket ? (
          <div className="glass-card p-8 animate-slide-up">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Raise New Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input 
                  required
                  className="input-field" 
                  placeholder="e.g., Payment issue, KYC update"
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select 
                  className="input-field"
                  onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="input-field resize-none" 
                  placeholder="Describe your issue in detail..."
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Creating...' : 'Submit Ticket'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : selectedTicket ? (
          <div className="glass-card h-[600px] flex flex-col animate-fade-in">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{selectedTicket.subject}</h3>
                <span className="text-xs font-bold text-slate-400">#{selectedTicket._id?.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-md font-bold uppercase tracking-wider">
                  {selectedTicket.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-medium">Opened on {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Initial Description */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <UserIcon size={20} className="text-slate-500" />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Messages */}
              {selectedTicket.messages?.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.sender === selectedTicket.userId ? '' : 'flex-row-reverse'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === selectedTicket.userId ? 'bg-slate-100' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {msg.sender === selectedTicket.userId ? <UserIcon size={20} className="text-slate-500" /> : <MessageSquare size={20} />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] ${
                    msg.sender === selectedTicket.userId 
                    ? 'bg-white border border-slate-100 rounded-tl-none' 
                    : 'bg-primary-600 text-white rounded-tr-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-2 font-medium ${msg.sender === selectedTicket.userId ? 'text-slate-400' : 'text-primary-200'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 mt-auto">
              <form onSubmit={handleSendReply} className="flex gap-3">
                <input 
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type your reply here..."
                  className="input-field h-12 flex-1"
                />
                <button type="submit" className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="glass-card h-[600px] flex flex-col items-center justify-center text-slate-400 opacity-60">
            <MessageSquare size={80} className="mb-6 stroke-[1]" />
            <p className="text-lg font-medium">Select a ticket to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportSystem;
