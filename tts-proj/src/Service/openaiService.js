const apiUrl = process.env.REACT_APP_OPENAI_API_URL;
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
};

async function getOpenAIResponse(prompt) {
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant. and you have to give information about question provided by the user.' },
            { role: 'user', content: prompt }
        ]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    const result = await response.json();

    console.log(`Response:${JSON.stringify(result)}'`);

    if (result && result.choices && result.choices.length > 0) {
        return result.choices[0].message.content;
    } else {
        throw new Error('Invalid response.');
    }
}

export { getOpenAIResponse };
