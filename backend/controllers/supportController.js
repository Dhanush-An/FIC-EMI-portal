const SupportTicket = require('../models/SupportTicket');

// @desc    Create support ticket
// @route   POST /api/support/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const ticket = await SupportTicket.create({
      userId: req.user.id,
      subject,
      description,
      priority,
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get user's tickets
// @route   GET /api/support/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      query = SupportTicket.find().populate('userId', 'name email');
    } else {
      query = SupportTicket.find({ userId: req.user.id });
    }
    const tickets = await query.sort('-createdAt');
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Add message to ticket
// @route   POST /api/support/tickets/:id/message
// @access  Private
exports.addMessage = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    ticket.messages.push({
      sender: req.user.id,
      text: req.body.text,
    });

    if (req.user.role === 'admin' || req.user.role === 'staff') {
      ticket.status = 'In Progress';
    }

    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
