import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getFallbackReply(message: string) {
  const question = message.toLowerCase();

  if (question.includes("html")) {
    return "HTML stands for HyperText Markup Language. It is used to structure web pages using elements such as headings, paragraphs, links, images, and forms.";
  }

  if (question.includes("css")) {
    return "CSS stands for Cascading Style Sheets. It is used to style web pages by controlling colors, fonts, spacing, layouts, and responsive designs.";
  }

  if (
    question.includes("javascript") ||
    question.includes("java script")
  ) {
    return "JavaScript is a programming language used to make websites interactive. It can respond to events, update page content, validate forms, and communicate with servers.";
  }

  if (
    question.includes("c programming") ||
    question.includes("c language") ||
    question.trim() === "c"
  ) {
    return "C is a general-purpose programming language. It supports variables, data types, operators, conditions, loops, functions, arrays, and pointers.";
  }

  if (question.includes("loop")) {
    return "A loop repeats a set of instructions. Common loops in C are for, while, and do-while. A for loop is useful when you know how many times to repeat an instruction.";
  }

  if (question.includes("array")) {
    return "An array stores multiple values of the same data type under one name. In C, array indexing starts at 0. Example: int marks[3] = {70, 80, 90};";
  }

  if (question.includes("function")) {
    return "A function is a reusable block of code that performs a specific task. Functions help organize programs and avoid repeating code.";
  }

  if (question.includes("variable")) {
    return "A variable is a named storage location for data. In C, you declare a variable with a data type, such as int age = 20;.";
  }

  if (question.includes("pointer")) {
    return "A pointer is a variable that stores the memory address of another variable. In C, & obtains an address and * is used to declare or dereference a pointer.";
  }

  if (question.includes("algorithm")) {
    return "An algorithm is a finite sequence of clear steps used to solve a problem. It has defined inputs, outputs, and a stopping condition.";
  }

  if (question.includes("data structure")) {
    return "A data structure organizes and stores data for efficient access and modification. Examples include arrays, linked lists, stacks, queues, trees, and graphs.";
  }

  if (question.includes("database") || question.includes("dbms")) {
    return "A database is an organized collection of data. A DBMS is software used to create, manage, retrieve, and update databases.";
  }

  if (
    question.includes("hello") ||
    question.includes("hi") ||
    question.includes("hey")
  ) {
    return "Hello! Welcome to EduSphere. Ask me about programming or computer science topics such as HTML, CSS, C, loops, arrays, or data structures.";
  }

  return "The AI assistant is temporarily unavailable. You can still ask about HTML, CSS, C programming, JavaScript, loops, arrays, functions, pointers, algorithms, or data structures.";
}

export async function POST(request: Request) {
  let userMessage = "";

  try {
    const body = await request.json();

    userMessage =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!userMessage) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
  console.error("OPENROUTER_API_KEY is missing");

  return NextResponse.json(
    { error: "OPENROUTER_API_KEY is missing in Vercel." },
    { status: 500 }
  );
}

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "EduSphere Assistant",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content:
                "You are EduSphere Assistant, a friendly study tutor. Explain programming and computer science concepts clearly for students. Use simple language, examples, and concise answers. If a question is unrelated to studying, politely guide the student back to learning topics.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
  const errorText = await response.text();

  console.error("OPENROUTER ERROR STATUS:", response.status);
  console.error("OPENROUTER ERROR BODY:", errorText);

  return NextResponse.json(
    {
      error: "OpenRouter API request failed",
      status: response.status,
      details: errorText,
    },
    { status: 500 }
  );
}

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
  console.error("OPENROUTER EMPTY REPLY:", JSON.stringify(data));

  return NextResponse.json(
    { error: "OpenRouter returned an empty AI reply." },
    { status: 502 }
  );
}

        return NextResponse.json({
      reply: reply.trim(),
      fallback: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown chat API error",
      },
      { status: 500 }
    );
  }
}