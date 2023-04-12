from .prompts import (
    cl_prompt_one,
    cl_prompt_two,
    cl_prompt_three,
    resume_ATS_prompt,
    corr_application_follow_up,
    corr_initial_connection_request,
    corr_application_follow_up,
    corr_informational_interview_request,
    corr_thank_you_informational_interview,
    corr_thank_you_formal_interview,
    corr_request_for_feedback,
    corr_job_offer_follow_up,
    corr_job_offer_acceptance_decline,
    corr_reconnection
)
from ..models import db, User
import os
import openai
openai.api_key = os.getenv('OPENAI_API_KEY')


def call_gpt(messages, user, model='gpt-3.5-turbo'):
    """
    Sends a request for chat completion to OpenAI
    messages parameter is a list of objects, each object containing 'role' and 'content' attributes
    specific model can be specified in params, defaulting to 'gpt-3.5-turbo'
    """
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages
        )
    except openai.error.APIConnectionError as e:
        return {"error": "OpenAI API connection error", "details": str(e)}, 503

    if response.choices[0].message.content is not None and user is not None:
        current_user = User.query.get(user.id)
        current_user.generation_balance -= 1
        db.session.commit()

    # print(response.choices[0].message.content)
    return response.choices[0].message.content


def generate_gpt_cover_letter(resume, job_description, company_details, engine, user):
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

    return call_gpt(messages, user, engine)


def generate_gpt_correspondence(context, corr_type, engine, user):
    """
    Generates a correspondence using OpenAI's chat completion api.
    Dynamically generated according to passed in 'context' and 'corr_type'
    """
    # Determine prompt based on passed in 'corr_type'
    prompt = None
    if corr_type.lower() == 'application follow-up':
        # Context should be a cover letter
        prompt = corr_application_follow_up(context)
    elif corr_type.lower() == 'initial connection':
        # Context should be a cover letter
        prompt = corr_initial_connection_request(context)
    elif corr_type.lower() == 'informational interview':
        # Context should be a cover letter
        prompt = corr_informational_interview_request(context)
    elif corr_type.lower() == 'thank you informational interview':
        # Context should be a cover letter
        prompt = corr_thank_you_informational_interview(context)
    elif corr_type.lower() == 'thank you formal interview':
        # Context should be a cover letter
        prompt = corr_thank_you_formal_interview(context)
    elif corr_type.lower() == 'request feedback':
        # Context should be job application rejection details or in absence a cover letter, eg. rejected in the first or last round of interviews etc...
        prompt = corr_request_for_feedback(context)
    elif corr_type.lower() == 'job offer follow-up':
        # Context should be a cover letter or job offer details
        prompt = corr_job_offer_follow_up(context)
    elif corr_type.lower() == 'job offer accept':
        # Context should be a cover letter or job offer details
        prompt = corr_job_offer_acceptance_decline(context)
    elif corr_type.lower() == 'job offer decline':
        # Context should be a cover letter or job offer details
        prompt = corr_job_offer_acceptance_decline(context, 'decline offer')
    elif corr_type.lower() == 'reconnection':
        # Context should be any messages or description of previous correspondence
        prompt = corr_reconnection(context)

    messages = [
        {"role": "system", "content": "You will act as an expert LinkedIn and email corresponder for job hunters. You will create LinkedIn and Email follow-up messages for recruiters and create replies to emails related to the job search."},
        {"role": "user", "content": f'{prompt}'},
        {"role": "assistant", "content": "Assistant generates a correspondences for LinkedIn or Email with user's context"}
    ]

    return call_gpt(messages, user, engine)

def generate_gpt_optimized_resume(resume, job_description, engine, user):
    """
    Generates an optimized resume using OpenAI's chat completion API.
    """

    messages = [
        {"role": "system", "content": "You are an expert ATS resume optimizer who will help to optimize a resume for a specific job without adding any new experiences or skills that the candidate doesn't already have."},
        {"role": "user", "content": resume_ATS_prompt(resume, job_description)},
        {"role": "assistant", "content": 'Assistant generates an optimized resume here'}
    ]

    return call_gpt(messages, user, engine)
