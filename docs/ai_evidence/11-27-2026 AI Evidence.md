# 11-27-2026 AI Evidence
- LLM Used: ChatGPT
- Stage: Frontend Development
- Context: item_review.js did not give proper visual feedback or respond to database input

## 1. Fix item_review logic

### Prompt
Fix the following issues:
1. The "Submit Review" button does not seem to call submitReview method
2. Clicking star elements does not visually change the icons (when the variable is updated)
...(includes rest of item_review.js)

### Output

There are two main issues in your code:

Submit button: JavaScript event handlers are case-sensitive. You used button.onClick instead of button.onclick.

Star icons: Updating reviewRating does not automatically update the image sources. You need to refresh the star images whenever a star is clicked.

Here's a corrected version of your code.

- Decision: Accepted
  - Accepted because it corrected mistakes I made
- Verified by testing page functionality
- Responsible Student: Jack
- Lessons Learned
  - Syntax and capitalization is important in programming