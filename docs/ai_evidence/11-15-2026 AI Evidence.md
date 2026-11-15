# 11-15-2026 AI Evidence
- LLM Used: Microsoft Copilot
- Software Used: Visual Code Studio
- Stage: Prototype Development
- Context: 
I was very unfamiliar with how to properly set up the connection between a frontend and a backend with a server.
To solve this, I asked "In database application, how can I setup a server to connect a frontend and the backend
ReviewApp.java"
- Recommendation: See the 11-15-2026 commit. Overhauls backend code and README.
- Decision: Revised
  - While the backend was implemented in a satisfactory manner, I was unhappy
with the additions made in the frontend and README that do not align with my vision
for the website. The backend will also need to change eventually, as I do not want the
login page to be the default page, nor have it connected to the signup page in the way that
it was implemented.
- Verification: I manually ran through the README and tested the website functionality
before saving and commiting the code.
- Responsible Student: Jack
- Lessons Learned
  - The server implementation was familiar to me, as in another course I am also creating an application with a frontend
  and backend. Seeing the actually changes in the Git helped me understand this process more.
  - I struggled to know where to start with this step of the process Using an AI
  assistant helped speed up a part of development that could have created time crunch if I tried to create the server
  myself without help.
  - I should try to be more specific with the goal of my prompts to prevent AI from doing the work for me, and increase
  the amount of information I learn myself through the experience.