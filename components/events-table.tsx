/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/vzZEKFcYodE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  events: [
    {
      title: string;
      date: string;
      address: string;
      link: string;
    }
  ];
};

export function EventsTable({ events }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-3 text-left font-medium">Event</th>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Location</th>
          </tr>
        </thead>
        <tbody>
          {events?.map((event, index: number) => (
            <tr className="border-b" key={index}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-muted-foreground">
                    Google's annual developer conference
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">{event.date}</span>
              </td>
              <td className="px-4 py-3 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">{event.address}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={event.link} target="_blank">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
