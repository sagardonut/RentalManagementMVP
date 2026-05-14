const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('❌ CRITICAL: GROQ_API_KEY is not defined in environment variables.');
      return res.status(500).json({ 
        success: false,
        error: 'Groq API key is not configured on the server' 
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Groq API Error:', errorData);
      return res.status(response.status).json({ 
        success: false,
        error: 'Failed to fetch response from Groq API',
        details: errorData.error?.message || 'Unknown API error'
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ 
      success: true,
      reply 
    });

  } catch (error) {
    console.error('❌ Chat Controller Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'An internal server error occurred processing your chat request' 
    });
  }
};

module.exports = {
  handleChat
};
