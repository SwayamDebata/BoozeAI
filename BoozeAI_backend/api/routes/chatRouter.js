const express = require('express');
const router = express.Router();
const AnonymousChat = require('../../models/ChatSession');
const { v4: uuidv4 } = require('uuid');
const { CometChat } = require('@cometchat/chat-sdk-react-native');
require('dotenv').config();

const apiKey = process.env.COMETCHAT_API_KEY;
const appId = process.env.COMETCHAT_APP_ID;
const region = process.env.COMETCHAT_REGION;

CometChat.init(appId, new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build());

function generateUsername() {
  const adjectives = ['Cool', 'Witty', 'Brave', 'Shy', 'Goofy'];
  const animals = ['Panda', 'Tiger', 'Sloth', 'Koala', 'Zebra'];
  return adjectives[Math.floor(Math.random() * adjectives.length)] + animals[Math.floor(Math.random() * animals.length)];
}

// Route: POST /api/anonymous-chat/join
router.post('/join', async (req, res) => {
  try {
    const userId = 'anon_' + uuidv4();
    const username = generateUsername();

    // Create CometChat user
    const user = new CometChat.User(userId);
    user.setName(username);
    try {
      await CometChat.createUser(user, apiKey);
    } catch (err) {
      if (err.code !== 'ERR_UID_ALREADY_EXISTS') {
        return res.status(500).json({ error: 'Failed to create CometChat user' });
      }
    }

    // Check for a waiting user
    const waitingUser = await AnonymousChat.findOne({ isMatched: false, userId: { $ne: userId } });

    if (waitingUser) {
      const groupId = uuidv4();
      // Update both users as matched
      await Promise.all([
        AnonymousChat.findOneAndUpdate({ userId: waitingUser.userId }, {
          isMatched: true,
          matchedWith: userId,
          groupId
        }),
        AnonymousChat.create({
          userId,
          username,
          isMatched: true,
          matchedWith: waitingUser.userId,
          groupId
        })
      ]);
      return res.status(200).json({ status: 'matched', userId, username, groupId, partnerId: waitingUser.userId });
    }

    // No match yet, add to queue
    await AnonymousChat.create({ userId, username });
    return res.status(200).json({ status: 'waiting', userId, username });

  } catch (err) {
    console.error('Join error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: GET /api/anonymous-chat/status/:userId
router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await AnonymousChat.findOne({ userId });
  if (!user) return res.status(404).json({ status: 'not_found' });

  if (user.isMatched) {
    return res.status(200).json({
      status: 'matched',
      groupId: user.groupId,
      matchedWith: user.matchedWith
    });
  }

  res.status(200).json({ status: 'waiting' });
});

// Route: POST /api/anonymous-chat/leave
router.post('/leave', async (req, res) => {
  const { userId } = req.body;
  try {
    await AnonymousChat.deleteOne({ userId });
    await CometChat.deleteUser(userId, apiKey);
    res.json({ message: 'Left chat and deleted user' });
  } catch (err) {
    console.error('Leave error:', err);
    res.status(500).json({ error: 'Failed to leave chat' });
  }
});

module.exports = router;
