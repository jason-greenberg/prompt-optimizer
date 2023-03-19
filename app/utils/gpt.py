import os
import openai
openai.api_key = os.getenv('OPENAI_API_KEY')

def call_gpt(messages, model='gpt-3.5-turbo'):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages
    )

    print(response.choices[0].message.content)
    return response.choices[0].message.content
