from .prompts import (
    cl_prompt_one, cl_prompt_two, cl_prompt_three, corr_linkedin_follow_up
    )
import os
import openai
openai.api_key = os.getenv('OPENAI_API_KEY')


def call_gpt(messages, model='gpt-3.5-turbo'):
    """
    Sends a request for chat completion to OpenAI
    messages parameter is a list of objects, each object containing 'role' and 'content' attributes
    specific model can be specified in params, defaulting to 'gpt-3.5-turbo'
    """
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages
    )

    print(response.choices[0].message.content)
    return response.choices[0].message.content


def generate_gpt_cover_letter(resume, job_description, company_details, engine):
    """
    Generates a cover letter using OpenAI's chat completion api. Iterates through a succession of prompts to generate the best possible cover letter
    """
    messages = [
        {"role": "system", "content": "You will act as an expert in editing cover letters for junior web developers, who wants to include detail about why, on a personal interest level, a candidate is a good fit for a role."},
        {"role": "user", "content": cl_prompt_one(resume, job_description)},
        {"role": "assistant", "content": 'Assistant generates a cover letter here'},
        {"role": "user", "content": cl_prompt_two(company_details)},
        {"role": "assistant",
            "content": 'Assistant generates a revised, more personable cover letter here'},
        {"role": "user", "content": cl_prompt_three()},
        {"role": "assistant", "content": 'Assistant generates another revision, to include applicants qualifications for the job'}
    ]

    return call_gpt(messages, engine)

def generate_gpt_correspondence(context, corr_type, engine):
    """
    Generates a correspondence using OpenAI's chat completion api.
    Dynamically generated according to passed in 'context' and 'type'
    """
    # Determine prompt based on passed in type
    prompt = None
    if corr_type.lower() == 'linkedin post-application follow-up':
        prompt = corr_linkedin_follow_up(context)

    messages = [
        {"role": "system", "content": "You will act as an expert LinkedIn and email corresponder for job hunters. You will create LinkedIn and Email follow-up messages for recruiters and create replies to emails related to the job search."},
        {"role": "user", "content": {prompt}},
        {"role": "assistant", "content": "Assistant generates a correspondences for LinkedIn or Email with user's context"}
    ]

    return call_gpt(messages, engine)
