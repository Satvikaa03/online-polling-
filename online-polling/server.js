const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

let polls = [];
let pollIdCounter = 1;

// Create a poll
app.post("/create", (req, res) => {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
        return res.status(400).json({ error: "Invalid poll data" });
    }

    const poll = {
        id: pollIdCounter++,
        question,
        options: options.map(option => ({ text: option, votes: 0 }))
    };

    polls.push(poll);
    res.json({ message: "Poll created", poll });
});

// Fetch all polls
app.get("/polls", (req, res) => {
    res.json(polls);
});

// Vote on a poll
app.post("/vote", (req, res) => {
    const { pollId, optionIndex } = req.body;
    const poll = polls.find(p => p.id === pollId);

    if (!poll || poll.options[optionIndex] === undefined) {
        return res.status(400).json({ error: "Invalid poll or option" });
    }

    poll.options[optionIndex].votes++;
    res.json({ message: "Vote recorded", poll });
});

// DELETE poll (Fixing the issue)
app.delete("/delete/:id", (req, res) => {
    const pollId = parseInt(req.params.id);
    const index = polls.findIndex(poll => poll.id === pollId);

    if (index === -1) {
        return res.status(404).json({ error: "Poll not found" });
    }

    polls.splice(index, 1);
    res.json({ message: "Poll deleted successfully" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
