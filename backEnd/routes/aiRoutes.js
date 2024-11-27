const express = require('express');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();
const router = express.Router()
const hf = new HfInference(process.env.HF_API_KEY);
const Blog = require('../models/Blog');

// router.post('/summarize', async (req, res) => {
//     const { text } = req.body;

//     try {
//         // Validate input
//         if (!text || typeof text !== 'string') {
//             return res.status(400).json({ error: 'Invalid input: "text" must be a non-empty string.' });
//         }

//         // Call to Hugging Face API
//         const result = await hf.summarization({
//             model: 'facebook/bart-large-cnn', // Updated model
//             inputs: text,
//         });

//         console.log('AI API Response:', result);

//         // Validate AI response
//         if (result?.summary_text) {
//             res.status(200).json({ summary: result.summary_text });
//         } else {
//             res.status(500).json({ error: 'Unexpected API response structure.' });
//         }
//     } catch (error) {
//         console.error('Error:', error.message || error);
//         res.status(500).json({ error: 'Failed to summarize text. ' + error.message });
//     }
// });

// router.post('/summarize', async (req, res) => {
//     const { text } = req.body;

//     try {
//         // Validate input
//         if (!text || typeof text !== 'string') {
//             return res.status(400).json({ error: 'Invalid input: "text" must be a non-empty string.' });
//         }

//         // Call to Hugging Face API (hf.request)
//         const result = await hf.request({
//             model: 'mistralai/Mistral-7B-Instruct-v0.3',
//             inputs: text,
//         });

//         console.log('AI API Response:', result);

//         // Validate AI response
//         if (result?.summary_text) {
//             res.status(200).json({ summary: result.summary_text });
//         } else {
//             res.status(500).json({ error: 'Unexpected API response structure.' });
//         }
//     } catch (error) {
//         console.error('Error:', error.message || error);
//         res.status(500).json({ error: 'Failed to summarize text. ' + error.message });
//     }
// });







// In your Express app
// router.post('/summarize', async (req, res) => {
//     const { content } = req.body;
//     try {
//         // Perform text summarization using an AI model or other methods
//         const summary = await summarizeText(content);  // You would define summarizeText
//         res.json({ summary });  // Send the summary back to the frontend
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error summarizing text' });
//     }
// });



///api/ai
  // router.post('/generate', async (req, res) => {
  //   const { prompt } = req.body;
  //   try {
  //     const result = await hf.textGeneration({
  //       model: 'mistralai/Mistral-7B-Instruct-v0.3',
  //       inputs: prompt,
  //       parameters: { max_new_tokens: 700 },
  //     });
  //     const generatedText = result.generated_text;

  //       // Create a new blog post using the generated content
  //       const newBlog = new Blog({
  //           title: `Generated Blog: ${prompt.substring(0, 50)}...`, // Using the prompt as a temporary title
  //           content: generatedText
  //       });

  //       // Save the new blog post to the database
  //       await newBlog.save();

  //       res.json({ blogPost: generatedText });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Error generating text' });
  //   }
  // });
  router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    try {
        const result = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.3',
            inputs: prompt,
            parameters: { max_new_tokens: 700 },
        });
        const generatedText = result.generated_text;
        
        // Send back generated content only
        res.json({ blogPost: generatedText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating text' });
    }
});
async function summarizeWithRetries(hf, text, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try { 
            console.log(`Attempt ${attempt}/${retries}: Sending request to model...`);
            const result = await hf.summarization({
                model: "facebook/bart-large-cnn",
                inputs: text,
                parameters: { min_length:100,max_new_tokens: 800 }, // Limit summary length
                //facebook/bart-large-cnn
            });
            console.log("Successful response:", result);
            return result; // Return result on success
        } catch (error) {
            console.warn(`Attempt ${attempt} failed:, error.message || error.response?.data`);

            // Check for specific errors (rate limits, input size issues)
            if (error.response?.status === 429) {
                console.warn("Rate limit exceeded. Retrying after delay...");
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
            } else if (error.response?.status === 400) {
                console.error("Bad request: Likely input too large or invalid.");
                throw new Error("Input too large or invalid for summarization.");
            }

            if (attempt === retries) throw error; // Throw after final retry
        }
    }
}



router.post("/summarize", async (req, res) => {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid input. Please provide valid text." });
    }

    try {
        console.log("Starting summarization process...");
        
        // Trim input to avoid token limit errors
        const trimmedText = text.length > 1024 ? text.slice(0, 1024) : text;

        // Attempt summarization with retries
        const result = await summarizeWithRetries(hf, trimmedText);
        const summary = Array.isArray(result) ? result[0]?.summary_text : result.summary_text;

        if (!summary) {
            throw new Error("Summary not generated. No valid response from model.");
        }

        res.json({ summary });
    } catch (error) {
        console.error("Error during summarization:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate summary. Please try again later." });
    }
});
module.exports = router;
