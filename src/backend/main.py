from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict  # Add Dict here
import os
from dotenv import load_dotenv
from openai import OpenAI
import logging


from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig






# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


# Load environment variables
load_dotenv()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")


logger.debug(f"API Key loaded: {'Yes' if PERPLEXITY_API_KEY else 'No'}")


app = FastAPI()


# Configure CORS
app.add_middleware(
   CORSMiddleware,
   allow_origins=["http://localhost:3000"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)


# Pydantic models
class Message(BaseModel):
   role: str
   content: str


class ChatRequest(BaseModel):
   messages: List[Message]


class Source(BaseModel):
   title: str
   url: str


class ChatResponse(BaseModel):
   text: str
   sources: Optional[List[Source]] = None


# Initialize OpenAI client
client = OpenAI(
   api_key=PERPLEXITY_API_KEY,
   base_url="https://api.perplexity.ai"
)


# Add these after your existing models
class TextInput(BaseModel):
   text: str


class AnonymizationResult(BaseModel):
   anonymized_text: str
   entities_found: List[Dict]


# Initialize Presidio engines after your OpenAI client initialization
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()


# Add this new endpoint
@app.post("/api/anonymize")
async def anonymize_text(input_data: TextInput):
   try:
       # Get all supported entities
       supported_entities = analyzer.get_supported_entities()


       # Analyze text with Presidio
       analyzer_results = analyzer.analyze(
           text=input_data.text,
           language="en",
           entities=supported_entities
       )


       # Create operators for all supported entities
       operators = {
           entity_type: OperatorConfig(
               "replace",
               {"new_value": f"[{entity_type}]"}
           )
           for entity_type in supported_entities
       }


       # Anonymize the identified entities
       anonymized_result = anonymizer.anonymize(
           text=input_data.text,
           analyzer_results=analyzer_results,
           operators=operators
       )


       # Extract entity information
       entities_found = [
           {
               "entity_type": result.entity_type,
               "start": result.start,
               "end": result.end,
               "score": result.score
           }
           for result in analyzer_results
       ]


       return AnonymizationResult(
           anonymized_text=anonymized_result.text,
           entities_found=entities_found
       )


   except Exception as e:
       raise HTTPException(status_code=500, detail=str(e))


# Middleware to add security headers including COOP and COEP
@app.middleware("http")
async def add_security_headers(request, call_next):
   response = await call_next(request)
   response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
   response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
   return response




async def call_perplexity_api(messages: List[Message]) -> ChatResponse:
   try:
       logger.debug(f"Received messages: {messages}")
      
       # Format messages with system prompt for structured output
       formatted_messages = [
           {
               "role": "system",
               "content": "You are an AI-chatbot-powered research and conversational search engine that answers user search queries. Format your response in markdown with proper headers (##, ###), lists, emphasis (*italic*, **bold**), and code blocks where appropriate. Structure your response with clear sections and use markdown formatting to enhance readability"
           }
       ]
       formatted_messages.extend(
           {"role": msg.role, "content": msg.content} for msg in messages
       )
      
       logger.debug(f"Formatted messages: {formatted_messages}")


       # Make API call with increased max_tokens and temperature
       response = client.chat.completions.create(
           model="sonar-pro",
           messages=formatted_messages,
           temperature=0.7,
           max_tokens=2000,  # Increased token limit
           top_p=0.9
       )
      
       logger.debug(f"API Response received: {response}")


       # Extract response and citations
       answer = response.choices[0].message.content
       citations = response.citations if hasattr(response, 'citations') else []


       # Format citations if they exist
       if citations:
           answer += "\n\n## Sources\n"
           for i, citation in enumerate(citations, 1):
               answer += f"{i}. {citation}\n"


       return ChatResponse(
           text=answer,
           sources=[Source(title=f"Source {i+1}", url=url) for i, url in enumerate(citations)]
       )


   except Exception as e:
       logger.error(f"Error in API call: {str(e)}")
       raise HTTPException(
           status_code=500,
           detail=f"API call failed: {str(e)}"
       )


@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
   logger.info("Received chat request")
   try:
       logger.debug(f"Request body: {request}")
       response = await call_perplexity_api(request.messages)
       logger.debug(f"Response: {response}")
       return response
   except Exception as e:
       logger.error(f"Error processing request: {str(e)}")
       raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
   import uvicorn
   uvicorn.run(app, host="0.0.0.0", port=8000)

