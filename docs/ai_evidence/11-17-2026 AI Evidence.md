# 11-17-2026 AI Evidence
- LLM Used: Microsoft Copilot
- Software Used: Visual Code Studio
- Stage: Prototype Development
- Context:
  I was struggling with converting output in my backend method to get menu items into a JSON string.
- Recommendation: Create a new helper method that manually converts the array elements into a JSON string.
- Decision: Accepted
  - I accepted these changes because I was struggling with this problem, and this was my last option.
It returned menu items in the console like expected.
  - The only change I had to make was to re-implement a comment that credited a StackOverflow page where I got
some concepts on how to format time in Java.
- Verification: I tested the accuracy of the json request by setting the date to the "2026-11-02", which was the only
date at the time to include menu items. This returned a valid menu item.
- Responsible Student: Jack
- Lessons Learned
  - AI is a useful tool when you've exhausted all other options for solving a problem.
  - AI might suggest options that you had considered but were not sure how to implement.