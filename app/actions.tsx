"use server";

import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { WeatherCard } from "@/components/weather-card";
import { getSearchResults } from "@/lib/services/tavily";
import { BotCard, BotMessage } from "@/components/llm/message";
import { Loader2 } from "lucide-react";
import TavilySearch from "@/components/tavily-search";
import { searchGoogleEvents } from "@/lib/services/google-events";
import { EventsTable } from "@/components/events-table";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: React.ReactNode;
}

const LoadingComponent = () => (
  <Loader2 className="w-5 animate-spin stroke-zinc-900" />
);

const eventSearchSchema = z.object({
  q: z.string().describe("A query to search for events"),
});

const searchEvents = async (query: string) => {
  const results = await searchGoogleEvents(query);

  return results?.events_results?.map((item: any) => ({
    title: item.title,
    date: item?.date?.when,
    address: item?.address?.length && item?.address[0],
    link: item?.link,
  }));
};

const weatherSchema = z.object({
  location: z.string().describe("The location for which to get the weather"),
  condition: z
    .string()
    .describe("Weather condition e.g.e cloudy, sunny, windy, and etc"),
  temperature: z.number().describe("Current temperature"),
  description: z.string().describe("A complete weather description"),
});

const tavilySearchSchema = z.object({
  query: z
    .string()
    .describe(
      "User query to search about the current events and information that is not available to large language models"
    ),
});

const searchTavily = async (query: string) => {
  const response = await getSearchResults(query);

  return {
    description: response?.answer,
    links: response?.results?.map((item: any) => ({
      title: item.title,
      url: item.url,
    })),
  };
};

const getWeatherInfo = async (
  location: string,
  condition: string,
  temperature: number,
  description: string
) => {
  return {
    loc: location,
    cond: condition,
    temp: temperature,
    desc: description,
  };
};

export async function streamComponent(input: string): Promise<ClientMessage> {
  const history = getMutableAIState();
  history.update([
    ...history.get(),
    {
      role: "user",
      content: input,
    },
  ]);
  const result = await streamUI({
    model: openai("gpt-3.5-turbo-0125"),
    // system: systemPrompt,
    messages: [...history.get(), { role: "user", content: input }],
    initial: (
      <BotMessage className="items-center flex shrink-0 select-none justify-center">
        <Loader2 className="w-5 animate-spin stroke-zinc-900" />
      </BotMessage>
    ),
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }
      return <BotMessage>{content}</BotMessage>;
    },

    tools: {
      searchEvents: {
        description: "Search for events in a specific location",
        parameters: eventSearchSchema,
        generate: async function* ({ q: input }) {
          yield <LoadingComponent />;
          const results = await searchEvents(input);
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing events for ${input}`,
            },
          ]);
          return (
            <BotCard showAvatar={true}>
              <EventsTable events={results} />
            </BotCard>
          );
        },
      },
      getTavilySearchResults: {
        description:
          "Use this tool to get the information from the internet that is not available to large lanugage models. For example, current weather information, currency conversion information, information about a famous place, person or event.",
        parameters: tavilySearchSchema,
        generate: async function* ({ query: input }) {
          yield <LoadingComponent />;
          const { description, links } = await searchTavily(input);
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing hotel information for ${input}`,
            },
          ]);
          return (
            <BotCard showAvatar={true}>
              <TavilySearch description={description} links={links} />
            </BotCard>
          );
        },
      },
      getCurrentWeather: {
        description:
          "Extract the current weather information from the given string",
        parameters: weatherSchema,
        generate: async function* ({
          location,
          condition,
          temperature,
          description,
        }) {
          yield <LoadingComponent />;
          const { loc, cond, temp, desc } = await getWeatherInfo(
            location,
            condition,
            temperature,
            description
          );
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing hotel information for ${input}`,
            },
          ]);

          return (
            <BotCard showAvatar={true}>
              <WeatherCard
                location={loc}
                condition={cond}
                temperature={temp}
                description={desc}
              />
            </BotCard>
          );
        },
      },
      //   getAdditionalInformation: {
      //     description:
      //       "Use this tool to gather additional information from the user when details are missing in their query, such as the check-in and check-out dates, etc.",
      //     parameters: infoSchema,
      //     generate: async function* ({ description, questions }) {
      //       console.log("DESCRIPTION: ", description, questions);
      //       history.done((messages: ServerMessage[]) => [
      //         ...messages,
      //         {
      //           role: "assistant",
      //           content: `Showing hotel information for ${input}`,
      //         },
      //       ]);
      //       yield <LoadingComponent />;
      //       const result = await additionalInfo(description, questions);
      //       return <div>{JSON.stringify(result)}</div>;
      //     },
      //   },
      //   searchHotels: {
      //     description: "Get list of available hotels for given query",
      //     parameters: searchSchema,
      //     generate: async function* ({
      //       q,
      //       adults,
      //       check_in_date,
      //       check_out_date,
      //     }) {
      //       history.done((messages: ServerMessage[]) => [
      //         ...messages,
      //         {
      //           role: "assistant",
      //           content: `Showing hotel information for ${input}`,
      //         },
      //       ]);
      //       yield <LoadingComponent />;
      //       const hotels = await searchHotels(
      //         q,
      //         adults,
      //         check_in_date,
      //         check_out_date
      //       );

      //       return hotels.map((hotel) => <HotelCard />);
      //     },
      //   },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    streamComponent,
  },
  initialAIState: [],
  initialUIState: [],
});
