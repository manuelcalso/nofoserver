//SERVER
import express from "express";
import { Router } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const router = Router();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/openai", async (req, res) => {
  try {
    const { query } = req.body;
    const response = await openai.chat.completions.create({
      model: "text-davinci-002",
      prompt: query,
      max_tokens: 150,
    });
    res.json({ message: response.choices[0].text });
  } catch (error) {
    console.error("Error al generar la respuesta:", error);
    res.status(500).send("Error en el servidor");
  }
});

router.post("/generate-text", async (req, res) => {
  try {
    console.log("entrando a generate text")
    const userMessage = req.body.prompt;
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }], 
      model: "gpt-3.5-turbo",
      n: 1,
    });
    const generatedText = response.choices[0].message.content
    console.log("Generated text:", generatedText);
    res.json({ generatedText: generatedText });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

router.post("/generate-image", async (req, res) => {
  try {
    console.log("Entrando a generar imagen");
    const userMessage = req.body.prompt;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: userMessage,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;
    console.log("Imagen generada:", imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
