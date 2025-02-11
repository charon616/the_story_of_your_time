import { OpenAI } from 'openai';
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted on your local machine]
});

export async function GET(request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return NextResponse.json({ test: 'test' }, { status: 200 })
}

// // Send a new message to a thread
// export async function POST(request, { params: { threadId } }) {
//   const { content } = await request.json();

//   await openai.beta.threads.messages.create(threadId, {
//     role: "user",
//     content: content,
//   });

//   const stream = openai.beta.threads.runs.stream(threadId, {
//     assistant_id: assistantId,
//   });

//   return new Response(stream.toReadableStream());
// }


//asynchronous function which will return results once they are ready
export async function POST(request) {
  const { prompt } = await request.json();

  const output = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      { 
        role: "developer", 
        content: [
          {
            "type": "text",
            "text": "You are an AI that predicts the biography and timeline of a historical or fictional figure based on given attributes. Using the provided details from the user, generate a short profile and a chronological timeline in JSON format. Input Information is like Age, Occupation, Nationality, Gender, Year of Death"
          }
        ]
      },
      { 
        role: "user", 
        content: [
          {
            "type": "text",
            "text": prompt
          }
        ]
      },
      {
        role: "assistant",
        content: [
          {
            "type": "text",
            "text": "Please provide the specific details for age, occupation, nationality, and year of death so I can generate the biography and timeline for you."
          }
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "timeline_response",
        strict: true,
        "schema": {
          "type": "object",
          "properties": {
              "biography": {
                  "type": "string",
                  "description": "The biography of the historical or fictional figure within 100 words"
              },
              "timeline": {
                  "type": "array",
                  "description": "The chronological timeline of the historical or fictional figure",
                  "items": {
                      "type": "object",
                      "properties": {
                          "year": {
                              "type": "number",
                              "description": "The year of the event"
                          },
                          "event": {
                              "type": "string",
                              "description": "The event that occurred in the year"
                          }
                      },
                      "additionalProperties": false,
                      "required": [
                          "year", "event"
                      ]
                  }
              }
          },
          "additionalProperties": false,
          "required": [
              "biography", "timeline"
          ]
      }
      }
    },
    temperature: 1,
    max_completion_tokens: 2048,
    n:1 //defaults to one response generated, but you can change it here
  });

  try{
    return NextResponse.json(output.choices[0].message.content)
  } catch(error) {
    return NextResponse.json({ error: error })
  }
}
