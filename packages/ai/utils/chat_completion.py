from dotenv import load_dotenv
from openai import OpenAI
import json
import ast

from pydantic import ValidationError
from models.personas.agent_goal_response import AgentGoalResponse

load_dotenv()

client = OpenAI()


def chat_completion(messages):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    return response.choices[0].message.content

def chat_structured_output(messages, response_format):
    response = client.beta.chat.completions.parse(
        model="gpt-4.1-mini",
        messages=messages,
        response_format=response_format
    )

    return response.choices[0].message

def chat_agent_goal_response(messages) -> AgentGoalResponse:
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=messages,
                temperature=0.5
            )

            content = response.choices[0].message.content.strip()
            print(content)

            # Strip code block markers like ```json ... ```
            if content.startswith("```"):
                lines = content.splitlines()
                # Remove first line if it starts with ```
                if lines[0].startswith("```"):
                    lines = lines[1:]
                # Remove last line if it is ```
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                content = "\n".join(lines).strip()

            try:
                data = json.loads(content)
            except json.JSONDecodeError:
                data = ast.literal_eval(content)

            goal = AgentGoalResponse(**data)
            return goal

        except (json.JSONDecodeError, SyntaxError, ValidationError, ValueError) as e:
            print(f"[Attempt {attempt}] Failed to parse or validate response: {e}")
            if attempt < max_retries:
                continue
            else:
                raise RuntimeError(f"Failed to get valid AgentGoalResponse after {max_retries} attempts.") from e