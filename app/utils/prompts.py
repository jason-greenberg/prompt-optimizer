# ------ Cover Letter Prompts =======
def cl_prompt_one(resume, job_description):
    return f"""You will act as an expert in generating relatable cover letters for junior web developers. I will give you a resume and a job description to write the cover letter with. Avoid repeating any phrases given in your prompts verbatim. The letter should only be two paragraphs. Do not use the word 'junior'.
    ---
    Resume: 
    {resume}
    ---
    Job Description:
    {job_description}
    
    """


def cl_prompt_two(company_details):
    return f"""Now using some new details about the company, and the resume I provided you with earlier, include a paragraph at the beginning of the cover letter that explains why, on a personal level I am a good fit for the company.
    Be sure to avoid overly strong adjectives and avoid sounding cliche, or trite. This new paragraph should feel real. Explain why I want to work at this company in this paragraph.
    
    ---
    Additional company details:
    {company_details}
    """


def cl_prompt_three():
    return f"""Now, keep the interest and personal connection to the company in the next revision. This time, when you rewrite it, include toward the middle and a tasteful advertisement of my qualification match for the position, based on comparing my resume to the job description.
    
    """

# ------ Cover Letter Prompts V2 (In Testing) =======
def cl_prompt_one_v2(resume, job_description):
    return f"""You will act as an expert in generating engaging and relatable cover letters for junior web developers. I will give you a resume and a job description to write the cover letter with. Avoid repeating any phrases given in your prompts verbatim. The letter should only be two paragraphs. Do not use the word 'junior'.
    ---

    1. Resume (use specific text from this resume, and tell a story with it): 
    {resume}
    ---

    2. Job Description (match skills mentioned in the resume to the job description):
    {job_description}
    
    """


def cl_prompt_two_v2(company_details):
    return f"""Now using some new details about the company, and the resume I provided you with earlier, include a paragraph at the beginning of the cover letter that explains why, on a personal level I am a good fit for the company.
    Be sure to avoid overly strong adjectives and avoid sounding cliche, or trite. This new paragraph should feel real. Explain why I want to work at this company in this paragraph.
    
    ---
    Additional company details:
    {company_details}

    """


def cl_prompt_three_v2(resume):
    return f"""Go back and make sure the cover letter is ONLY mentioning skills and experiences from the provided resume. 
    1. Avoid hallucinating experience the applicant does not have. 
    2. The education on the resume, must match the education in described in this cover letter.
    3. The second paragraph should be specific and informed by the provided resume.

    Let's think this through step by step.
    ---

    Provided resume:

    {resume}

    """
# ------- Resume Prompts ----------
# Optimize resume for ATS
def resume_ATS_prompt(resume, job_description):
    return f"""Optimize the following resume for the provided job description without adding any new experiences or skills that the candidate doesn't already have. Please provide an optimized version of the resume that highlights the candidate's most relevant skills, experiences, and projects for the Front End Software Engineer role.
    1. Make sure the optimized resume is tailored for ATS systems by using relevant keywords and proper formatting.
    2. Do not remove an entire element from the resume unless there is a plan to replace it with an optimized version of the same element.
    3. Do not remove any projects in their entirety from a resume
    3. Identify and preserve section headers from the original resume. Make sure these headers are written in ALL CAPS (eg. "Work Experience" -> "WORK EXPERIENCE")
    4. At the bottom of the revised resume, include a list of all revisions made, under the header "REVISIONS"

    Resume:
    {resume}
    
    ---
    Job Description:
    {job_description}
    
    """

# ------- Correspondence Prompts -----
# Application follow up
def corr_application_follow_up(context):
    return f"""I just submitted a job application and I want to follow up with the recruiter on linked in who posted the position. Please use my submitted cover letter as context to write a very brief follow-up message with the recruiter, expressing my interest in the position.
    Use the cover letter to inform this response, not create a duplicate. Avoid cliche's and be friendly. This should look like a miniature cover letter, hitting on the most critical points.
    ---
    Original cover letter:
    {context}

    """

# Initial connection request:
def corr_initial_connection_request(context):
    return f"""I want to connect with a recruiter on LinkedIn and introduce myself. I am interested in a specific job opening or the company they represent. Please generate a connection request message based on the following cover letter. Avoid sounding overly syncophantic or cliche. Keep the response to 5 or 6 sentences.
    Job opening or company interest:
    {context}
    """

# Informational interview request:
def corr_informational_interview_request(context):
    return f"""I would like to request a brief informational interview with a recruiter to learn more about a specific role, company, or industry. Please generate a message to request an informational interview based on the following context:
    ---
    Role, company, or industry of interest:
    {context}
    """
# Thank you after an informational interview:
def corr_thank_you_informational_interview(context):
    return f"""I recently had an informational interview with a recruiter, and I want to send a thank you message. Please generate a message expressing gratitude and summarizing the key takeaways from the interview based on the following context:
    ---
    Informational interview details:
    {context}
    """
# Thank you after a formal job interview:
def corr_thank_you_formal_interview(context):
    return f"""I recently had a formal job interview and I want to send a thank you message to the recruiter. Please generate a message expressing gratitude, reiterating my interest in the role, and briefly mentioning key points from the interview based on the following context:
    ---
    Formal job interview details:
    {context}
    """
# Request for feedback:
def corr_request_for_feedback(context):
    return f"""I received a rejection for a job application, and I would like to ask the recruiter for constructive feedback to improve my job search process. Please generate a message requesting feedback based on the following context:
    ---
    Job application rejection details:
    {context}
    """
# Job offer follow-up:
def corr_job_offer_follow_up(context):
    return f"""I received a job offer and I want to follow up with the recruiter for clarification on details such as salary, benefits, start date, or other relevant aspects. Please generate a message to follow up on the job offer based on the job title mentioned in the cover letter provided:
    ---
    Job offer details:
    {context}
    """
# Job offer acceptance or decline:
def corr_job_offer_acceptance_decline(context, decision='accept offer'):
    return f"""I want to formally accept or decline a job offer and express gratitude for the opportunity. Please generate a message with my decision based on job title from the following cover letter. Focus on sounding genuine, but don't recite facts from the cover letter in the generated response. Keep it brief, no more than 5-6 sentences and professional:
    ---
    Job title found in this cover letter:
    {context}
    ---

    Decision: {decision}
    """
# Reconnection:
def corr_reconnection(context):
    return f"""I want to reconnect with a recruiter I've previously interacted with, especially when I am starting a new job search or seeking information about new opportunities. Please generate a message to reconnect with the recruiter based on the following context:
    ---
    Previous interaction context:
    {context}
    """
