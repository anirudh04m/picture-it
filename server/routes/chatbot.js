const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatBot = require('../models/ChatBot');
const geminiService = require('../services/geminiService');

// Get chatbot conversation history
router.get('/conversation', auth, async (req, res) => {
  try {
    let conversation = await ChatBot.findOne({ userId: req.user.id });
    
    if (!conversation) {
      // Create new conversation if none exists
      conversation = new ChatBot({
        userId: req.user.id,
        messages: []
      });
      await conversation.save();
    }

    res.json({
      success: true,
      messages: conversation.messages
    });
  } catch (error) {
    console.error('Error fetching chatbot conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation history'
    });
  }
});

// Send message to chatbot
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get or create conversation
    let conversation = await ChatBot.findOne({ userId: req.user.id });
    
    if (!conversation) {
      conversation = new ChatBot({
        userId: req.user.id,
        messages: []
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message.trim()
    });

    // Get conversation history for context (last 10 messages)
    const recentMessages = conversation.messages.slice(-10);
    
    // Generate AI response
    const aiResponse = await geminiService.generateResponse(message, recentMessages);

    if (aiResponse.success) {
      // Add AI response to conversation
      conversation.messages.push({
        role: 'assistant',
        content: aiResponse.message
      });

      await conversation.save();

      res.json({
        success: true,
        message: aiResponse.message,
        conversation: conversation.messages
      });
    } else {
      res.status(500).json({
        success: false,
        message: aiResponse.message
      });
    }

  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message'
    });
  }
});

// Clear conversation history
router.delete('/conversation', auth, async (req, res) => {
  try {
    await ChatBot.findOneAndDelete({ userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Conversation cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear conversation'
    });
  }
});

// Generate location hint for a photo
router.post('/hint', auth, async (req, res) => {
  try {
    const { photoDescription } = req.body;

    if (!photoDescription || !photoDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Photo description is required'
      });
    }

    const hintResponse = await geminiService.generateLocationHint(photoDescription);

    if (hintResponse.success) {
      res.json({
        success: true,
        hint: hintResponse.hint
      });
    } else {
      res.status(500).json({
        success: false,
        message: hintResponse.hint
      });
    }

  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate hint'
    });
  }
});

module.exports = router; 