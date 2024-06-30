import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFirstNCharacters } from "@/lib/utils";

type Props = {
  description: string;
  links: [
    {
      title: string;
      url: string;
    }
  ];
};

export default function TavilySearch({ description, links }: Props) {
  return (
    <Card className="pt-5">
      <CardContent>
        <div>{description}</div>
        <div className="mt-2 flex items-center gap-2">
          {links?.map((link, index: number) => (
            <Link key={index} href={link.url} target="_blank">
              <Badge>
                <span>{getFirstNCharacters(link.title, 20)}</span>
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
