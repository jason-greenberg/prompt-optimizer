def prompt_one(resume, job_description):
    return f"""You will act as an expert in generating relatable cover letters for junior web developers. I will give you a resume and a job description to write the cover letter with. Avoid repeating any phrases given in your prompts verbatim. The letter should only be two paragraphs. Do not use the word 'junior'.
    ---

    Resume: 
    {resume}
    ---

    Job Description:
    {job_description}
    
    """

def prompt_two(company_details):
    return f"""Now using some new details about the company, and the resume I provided you with earlier, include a paragraph at the beginning of the cover letter that explains why, on a personal level I am a good fit for the company.
    Be sure to avoid overly strong adjectives and avoid sounding cliche, or trite. This new paragraph should feel real. Explain why I want to work at this company in this paragraph.
    
    ---
    Additional company details:
    {company_details}

    """

def prompt_three():
    return f"""Now, keep the interest and personal connection to the company in the next revision. This time, when you rewrite it, include toward the middle and a tasteful advertisement of my qualification match for the position, based on comparing my resume to the job description.
    
    """
