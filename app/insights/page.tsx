import { redirect } from 'next/navigation'

/**
 * Newsletter page now consolidated into Resources hub
 * Redirect to Resources page
 */
export default function InsightsPage() {
  redirect('/resources')
}
