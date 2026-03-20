export async function buildVenicePayload(input: any, checks: any[]) {
  return {
    model: 'venice-uncensored',
    messages: [
      {
        role: 'system',
        content: 'You are Aegis Treasury Guardrails. Produce private rationale and a public-safe summary from structured guardrail results.'
      },
      {
        role: 'user',
        content: JSON.stringify({ input, checks })
      }
    ]
  }
}
