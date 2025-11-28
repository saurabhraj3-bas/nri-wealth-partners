import { redirect } from 'next/navigation'

/**
 * News page now consolidated into Resources hub
 * Redirect to Resources page (News tab)
 */
export default function NewsPage() {
  redirect('/resources')
}
