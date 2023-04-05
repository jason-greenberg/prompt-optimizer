from app.models import db, Resume, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds resume seed data
def seed_resumes():
    demo = User.query.get(1)

    demo_resume = Resume(
        user_id=demo.id, 
        resume_text="""FULL NAME
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

Javascript, React, Node.js, SQL, Python, Redux, Express.js, Sequelize, PostgreSQL, API Development, CSS, Secure Authentication, Git, Efficient Database Queries, Data Validation, Scrum, Visual Studio Code

PROJECTS

Project A (Platform clone) | Group Project -- Python, Flask, React, Redux, PostgreSQL
• Contributed entire full-stack portfolio CRUD for a web app simulating core functionalities of a popular trading platform
• Leveraged external API for live stock data, providing real-time paper-trading capabilities and realistic user experience
• Designed API routes for CRUD operations, supporting portfolios, transactions, watchlists, and chatbot integration
• Incorporated Chart.js for visually appealing, interactive charts displaying portfolio performance and stock data
• Integrated AI API for an intelligent, context-aware chatbot assisting in financial stock trading

Project B | Solo Project -- Node.js, Express, React, Redux, PostgreSQL
• Implemented authentication and authorization for a full-stack platform clone using the PERN stack.
• Utilized React Hooks and Redux for efficient state management, improving performance and user experience.
• Optimized data storage and retrieval by implementing table associations and dynamic error handling using Sequelize ORM in PostgreSQL.

Project C API | Solo Project -- Node.js, Express
• Utilized AI API to generate high-quality text based on user-input job description and company details.
• Improved text relevance and accuracy through prompt engineering by providing additional context and constraints
• Enhanced user experience by automating the writing process and delivering personalized results in real-time.
• Implemented error handling and security measures to ensure data privacy and integrity while interfacing with the AI API.

Project D
• Developed a full-stack web application using JavaScript, HTML, CSS, and Node.js to allow users to view and vote on images and submit comments on those images.
• Utilized local storage and cookie jars to persist vote counts and comments

WORK EXPERIENCE

Organization A | Clinical Research Coordinator                      Sep 2020 - Aug 2021
• Utilized software to clean and maintain a patient database for a clinical research study
• Assisted in the management of data collection, including patient charts, medical records, and diagnostics tests
• Coordinated with local IRB and study sponsors to ensure compliance and submission of necessary documents
• Recruited and enrolled study subjects and provided education and communication to patients and families
• Assisted with data analysis and visualization to explore the benefits of complementary and integrative health for chronic pain

University A | Research Assistant                                 Jun 2019 - Sep 2019
• Conducted meta-analyses and literature reviews on human and animal trauma in the Psychophysiology Lab
• Contributed to the design and implementation of emotion regulation interventions
• Participated in meetings and discussions with experts in the field of emotion regulation research

EDUCATION

Coding Bootcamp, City, State                                        2022 - 2023
Computer Software Engineering
6 Month Full Stack Software Engineering Program: JavaScript, React, Redux, SQL, Sequelize, Express, 
Python, Advanced Algorithms, Data Structures

University B, City, State                                            GPA: 3.8                 2016 - 2020
Bachelor of Science in Brain and Psychological Sciences, Applied Psychology Minor

Study Abroad Program, City, Country                                  2018
Language immersion, Medieval history, and Ancient history""",
        position_type='Fullstack',
        skill_level='Senior',
        created_at=datetime.utcnow()
    )

    resume1 = Resume(
        user_id=1,
        resume_text="""Full Name
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

JavaScript, React, Node.js, HTML, CSS, Git, SQL, PostgreSQL, Express, Redux, Mocha, Chai

PROJECTS

Project A
• Developed a full-stack web application using JavaScript, HTML, CSS, and Node.js to allow users to create and manage a to-do list
• Utilized Redux for state management and Sequelize ORM to interact with a PostgreSQL database
• Implemented test-driven development with Mocha and Chai

Project B
• Created a responsive website using React and Node.js to display a list of events
• Implemented client-side form validation and error handling using React Hooks
• Utilized Git for version control and deployment to Heroku

Project C
• Built a full-stack application using React, Node.js, and PostgreSQL
• Designed and implemented a database schema using Sequelize ORM
• Implemented server-side form validation and error handling using Express

WORK EXPERIENCE

Software Development Intern | Company Name                      Summer 2022
• Contributed to the development of a web-based application using React and Node.js
• Assisted in the implementation of database functionality using PostgreSQL
• Participated in Agile development methodologies

EDUCATION

Bachelor of Science in Computer Science | University Name              GPA: 3.8
City, State                                                                   May 2022""",
        position_type="Fullstack",
        skill_level="Mid-Level",
        created_at=datetime.utcnow()
    )

    resume2 = Resume(
        user_id=1,
        resume_text="""Full Name
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

JavaScript, Node.js, SQL, PostgreSQL, Express, Git, AWS, RESTful APIs

PROJECTS

Project A
• Built a RESTful API using Node.js and Express to provide access to user data
• Designed and implemented a database schema using PostgreSQL and Sequelize ORM
• Utilized AWS for deployment and scaling

Project B
• Created a command-line interface tool using Node.js to interact with a third-party API
• Implemented authentication and error handling using Node.js packages
• Utilized Git for version control and deployment to Heroku

Project C
• Built a full-stack application using Node.js, React, and PostgreSQL
• Designed and implemented a database schema using Sequelize ORM
• Utilized AWS for deployment and scaling

WORK EXPERIENCE

Software Development Intern | Company Name                      Summer 2022
• Contributed to the development of a web-based application using Node.js and React
• Assisted in the implementation of database functionality using PostgreSQL
• Participated in Agile development methodologies

EDUCATION

Bachelor of Science in Computer Science | University Name              GPA: 3.8
City, State                                                                   May 2022""",
        position_type="Backend",
        skill_level="Senior",
        created_at=datetime.utcnow()
    )

    resume3 = Resume(
        user_id=1,
        resume_text="""Full Name
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

JavaScript, React, Node.js, HTML, CSS, Git, SQL, PostgreSQL, Express, Redux, Agile Methodologies

PROJECTS

Project A
• Built a full-stack application using React, Node.js, and PostgreSQL
• Utilized Redux for state management and Sequelize ORM to interact with a PostgreSQL database
• Implemented test-driven development with Jest and Enzyme

Project B
• Created a responsive website using React and Node.js to display a list of events
• Implemented client-side form validation and error handling using React Hooks
• Utilized Git for version control and deployment to Heroku

Project C
• Built a RESTful API using Node.js, Express, and PostgreSQL to provide access to user data
• Designed and implemented a database schema using Sequelize ORM
• Utilized Agile methodologies for project management

WORK EXPERIENCE

Software Development Intern | Company Name                      Summer 2022
• Contributed to the development of a web-based application using React and Node.js
• Assisted in the implementation of database functionality using PostgreSQL
• Participated in Agile development methodologies

EDUCATION

Bachelor of Science in Computer Science | University Name              GPA: 3.8
City, State                                                                   May 2022""",
        position_type="Fullstack",
        skill_level="Senior",
        created_at=datetime.utcnow()
    )

    resume4 = Resume(
        user_id=1,
        resume_text="""Full Name
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

JavaScript, React, Node.js, HTML, CSS, Git, SQL, PostgreSQL, Express, Redux, Test-Driven Development

PROJECTS

Project A
• Built a full-stack application using React, Node.js, and PostgreSQL
• Utilized Redux for state management and Sequelize ORM to interact with a PostgreSQL database
• Implemented test-driven development with Jest and Enzyme

Project B
• Created a responsive website using React and Node.js to display a list of events
• Implemented client-side form validation and error handling using React Hooks
• Utilized Git for version control and deployment to Heroku

Project C
• Built a RESTful API using Node.js, Express, and PostgreSQL to provide access to user data
• Designed and implemented a database schema using Sequelize ORM
• Utilized test-driven development methodologies

WORK EXPERIENCE

Software Development Intern | Company Name                      Summer 2022
• Contributed to the development of a web-based application using React and Node.js
• Assisted in the implementation of database functionality using PostgreSQL
• Participated in Agile development methodologies

EDUCATION

Bachelor of Science in Computer Science | University Name              GPA: 3.8
City, State                                                                   May 2022""",
        position_type="Frontend",
        skill_level="Mid-Level",
        created_at=datetime.utcnow()
    )

    resume5 = Resume(
        user_id=1,
        resume_text="""FULL NAME
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

JavaScript, React, Node.js, HTML, CSS, Git, SQL, PostgreSQL, Express, Redux

PROJECTS

Project A
• Created a full-stack application using React, Node.js, and PostgreSQL
• Utilized Redux for state management and Sequelize ORM to interact with a PostgreSQL database
• Implemented server-side form validation and error handling

Project B
• Developed a RESTful API using Node.js, Express, and MongoDB
• Designed and implemented a database schema using Mongoose
• Utilized Git for version control and deployment to Heroku

Project C
• Built a responsive website using React and Bootstrap to display user profiles and portfolio information
• Implemented client-side form validation and error handling using React Hooks
• Utilized GitHub Pages for deployment

WORK EXPERIENCE

Software Development Intern | Company Name                      Summer 2022
• Contributed to the development of a web-based application using React and Node.js
• Assisted in the implementation of database functionality using PostgreSQL
• Participated in Agile development methodologies

EDUCATION

Bachelor of Science in Computer Science | University Name              GPA: 3.8
City, State                                                                   May 2022""",
        position_type="Fullstack",
        skill_level="Entry-Level",
        created_at=datetime.utcnow()
    )

    resume6 = Resume(
        user_id=1,
        resume_text="""FULL NAME
City, State ॱ Phone Number ॱ Email Address ॱ GitHub URL

SKILLS

JavaScript, React, Node.js, HTML, CSS, Git, SQL, PostgreSQL, Express, Sequelize

PROJECTS

Project A
• Built a full-stack application using React, Node.js, and PostgreSQL
• Utilized Sequelize ORM to interact with a PostgreSQL database and implement CRUD operations
• Implemented server-side form validation and error handling

Project B
• Developed a RESTful API using Node.js, Express, and MongoDB
• Designed and implemented a database schema using Mongoose
• Utilized Git for version control and deployment to Heroku

Project C
• Built a responsive website using React and Bootstrap to display user profiles and portfolio information
• Implemented client-side form validation and error handling using React Hooks
• Utilized GitHub Pages for deployment

WORK EXPERIENCE

Software Development Intern | Company Name                      Summer 2022
• Contributed to the development of a web-based application using React and Node.js
• Assisted in the implementation of database functionality using PostgreSQL
• Participated in Agile development methodologies

EDUCATION

Bachelor of Science in Computer Science | University Name              GPA: 3.8
City, State                                                                   May 2022""",
        position_type="Backend",
        skill_level="Mid-Level",
        created_at=datetime.utcnow()
    )

    db.session.add(demo_resume)
    db.session.add(resume1)
    db.session.add(resume2)
    db.session.add(resume3)
    db.session.add(resume4)
    db.session.add(resume5)
    db.session.add(resume6)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_resumes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.resumes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM resumes"))
        
    db.session.commit()
