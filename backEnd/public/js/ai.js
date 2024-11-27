const express = require('express');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();
const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);
const Blog = require('../models/Blog');


router.post('/summarize', async (req, res) => {
  const { text } = req.body;

  try {
      const result = await hf.request({
          model: 'mistralai/Mistral-7B-Instruct-v0.3',
          inputs: text,
      });

      console.log('API Response:', result);  // Log the API response for debugging.

      // Assuming the response structure is an array and summary is under `generated_text`
      const summaryText = result[0]?.generated_text;

      // Check if the summary text is available, else send an error
      if (summaryText) {
          // Send summary as response
          res.status(200).json({ summary: summaryText });
          console.log('Sent to Frontend:', { summary: summaryText }); // Log the response sent to the frontend
      } else {
          // If no summary is returned, send an error response
          res.status(500).json({ error: 'Unexpected API response structure.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to summarize text. ' + error.message });
  }
});




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

  module.exports = router;