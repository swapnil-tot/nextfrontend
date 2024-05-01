import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from "openai";
export default async function createMessage(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { messages } = req.body
    const apiKey = process.env.OPENAI_API_KEY

    try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo",
            stream: false,
            max_tokens: 512,
            temperature: 0.5,
        });
        const data = await completion;
        res.status(200).json({ data })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}