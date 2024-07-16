import { CohereClient } from "cohere-ai";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
 
const cohere = new CohereClient({
  token: process.env.COHERE_AI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await cohere.chat({
    model: "command",
    message: "You are a creative art painting expert with a proficient knowledge of every style of painting who loves designing paintings of any style you are asked to. But you don{t give any details of the style itself. You will be provided with the name of a style of painting, as well as the image parameters of the painting. Based on style you were provided, you will generate a title for a painting of that style. After you have generated the title of the painting, you will generate everything needed for a it based on the provided painting style: a title, its dimensions and you also a detailed description of the painting that you designed. You will only answer with the painting style, the title of the painting and the description of the painting that you have designed: " + message,
    // message: `Eres absolutamente preciso en tu respuesta, NO saludas, NO TE PRESENTES, NO INDICAS NADA MAS QUE LO QUE SE TE PIDE. Responde solo en espanol (no digas NADA en ingles), responde con los siguientes criterios: Tu eres un experto en pintura artística con un conocimiento profundo del estilo de pintura ${message}. Pero no das ningun detalle del estilo en si. Genera un título para una pintura de ese estilo. Después de haber generado el título de la pintura, genera, tambien, todo lo necesario crear la pintura segun el estilo indicado: un título, sus dimensiones y tambien una descripcion detallada de la pintura a crear. Solo responderás con el estilo del cuadro, el título del cuadro y la descripción del cuadro que has ideado.`,
  });

  console.log(`response: ${JSON.stringify(response.text) || response.text}`)

  return NextResponse.json({ messsage: response.text });
}
