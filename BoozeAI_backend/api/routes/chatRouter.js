const express = require('express');
const axios = require('axios');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const AnonymousChat = require('../../models/ChatSession');
const generateUsername = require('../utils/generateUsername');
const {
  COMETCHAT_API_KEY,
  COMETCHAT_API_URL,
} = require('../config/cometchat');

// Route: POST /api/anonymous-chat/join
router.post('/join', async (req, res) => {
  const userId = 'anon_' + uuidv4();
  const username = generateUsername();

  try {
    // 1. Create CometChat user via REST API
    await axios.post(
        COMETCHAT_API_URL, // which is now dynamically correct
        {
          uid: userId,
          name: username,
        },
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'appId': process.env.COMETCHAT_APP_ID,
            'apiKey': process.env.COMETCHAT_API_KEY,
          },
        }
      );
      

    // 2. Check if there's a waiting user
    const waitingUser = await AnonymousChat.findOne({
      isMatched: false,
      userId: { $ne: userId },
    });

    if (waitingUser) {
      const groupId = uuidv4();

      await Promise.all([
        AnonymousChat.findOneAndUpdate(
          { userId: waitingUser.userId },
          {
            isMatched: true,
            matchedWith: userId,
            groupId,
          }
        ),
        AnonymousChat.create({
          userId,
          username,
          isMatched: true,
          matchedWith: waitingUser.userId,
          groupId,
        }),
      ]);

      return res.status(200).json({
        status: 'matched',
        userId,
        username,
        groupId,
        partnerId: waitingUser.userId,
      });
    }

    // 3. Add current user to waiting queue
    await AnonymousChat.create({ userId, username });

    return res.status(200).json({
      status: 'waiting',
      userId,
      username,
    });
  } catch (err) {
    console.error('Join error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to join anonymous chat' });
  }
});

// Route: GET /api/anonymous-chat/status/:userId
router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await AnonymousChat.findOne({ userId });

    if (!user) return res.status(404).json({ status: 'not_found' });

    if (user.isMatched) {
      return res.status(200).json({
        status: 'matched',
        groupId: user.groupId,
        matchedWith: user.matchedWith,
      });
    }

    res.status(200).json({ status: 'waiting' });
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route: POST /api/anonymous-chat/leave
router.post('/leave', async (req, res) => {
  const { userId } = req.body;

  try {
    // 1. Remove from MongoDB queue
    await AnonymousChat.deleteOne({ userId });

    // 2. Delete CometChat user via REST API
    await axios.delete(`${COMETCHAT_API_URL}/${userId}`, {
      headers: {
        'accept': 'application/json',
        'appId': process.env.COMETCHAT_APP_ID,
        'apiKey': process.env.COMETCHAT_API_KEY,
      },
    });

    return res.json({ message: 'User left and deleted successfully' });
  } catch (err) {
    console.error('Leave error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to leave chat' });
  }
});

module.exports = router;
