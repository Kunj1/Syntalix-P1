const express = require('express');
const bodyParser = require('body-parser');
const { analyzePythonCode } = require('./PyComponent');

const app = express();
app.use(bodyParser.json());

app.post('/analyze', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Please provide code to analyze' });
    }

    const result = analyzePythonCode(code);
    return res.status(200).send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
