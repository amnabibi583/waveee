## Usage

1. Open the live application.
2. Enter a company name.
3. Choose company size and buying intent.
4. Click "Score this lead".
5. Read the Lead Score Card for the score, tier, reasons, and recommended next action.

## Architecture

User → React form → Local lead-scoring logic → Lead Score Card

The project is built with React and Vite. The form collects lead details, local scoring logic evaluates them, and the result is displayed as a structured card.

## Evaluation results

- Normal lead input: returns a structured score and recommendation.
- Empty input: shows validation feedback.
- `error` test input: shows a designed error state.
- `rate` test input: shows a rate-limit error state.
- `slow` test input: shows loading and Stop control.
- Mobile view: layout works on a narrow screen.

## Limitations

- This version uses local lead-scoring simulation, not a real external AI API.
- Scores are demonstration results, not real business predictions.
- Lead data is not saved in a database.

## AI transparency

I used AI as a coding and documentation assistant. I reviewed the code, tested the application states, and checked the final behaviour myself.
