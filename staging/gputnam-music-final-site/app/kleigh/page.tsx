import { redirect } from 'next/navigation';

// KLEIGH is a separate project at 2kleigh.com — this site links to it; does not host it.
export default function KleighRedirect() {
  redirect('https://www.2kleigh.com');
}
