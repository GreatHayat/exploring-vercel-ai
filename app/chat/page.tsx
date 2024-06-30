"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import ChatScrollAnchor from "@/components/chat-scroll-anchor";
import { Button } from "@/components/ui/button";
import { useEnterSubmit } from "@/lib/use-enter-submit";
import { useForm, SubmitHandler } from "react-hook-form";
import TextAreaAutoSize from "react-textarea-autosize";
import { ArrowDownIcon } from "lucide-react";
import { z } from "zod";
import type { AI } from "../actions";
import { UserMessage } from "@/components/llm/message";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type ChatInput = z.infer<typeof chatSchema>;
type UIState = Array<{
  id: number;
  role: "user" | "assistant";
  display: React.ReactNode;
}>;

type MessageProps = {
  messages: UIState;
};

const ChatList = ({ messages }: MessageProps) => {
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages?.map((message) => (
        <div key={message.id} className="pb-4">
          {message.display}
        </div>
      ))}
    </div>
  );
};

export default function Chat() {
  const form = useForm<ChatInput>();
  const { formRef, onKeyDown } = useEnterSubmit();

  const [component, setComponent] = useState<React.ReactNode>();
  const [messages, setMessages] = useUIState<typeof AI>();

  const { streamComponent } = useActions();

  const onSubmit: SubmitHandler<ChatInput> = async (data) => {
    const value = data.message.trim();
    formRef.current?.reset();
    console.log(value);
    if (!value) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: "user",
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      const responseMessage = await streamComponent(value);
      setMessages((currentMessages) => [...currentMessages, responseMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <div className="pb-[200px] pt-4 md:pt-10">
        <ChatList messages={messages} />
        <ChatScrollAnchor />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 top-50% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-300px">
        <div className="px-3 flex justify-center flex-col py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4 bg:white">
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto sm:max-w-2xl sm:px-4">
              <div className="mb-2 relative flex flex-col w-full overflow-hidden max-h-60 bg-background sm:rounded-md sm:border">
                <TextAreaAutoSize
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message"
                  className="min-h-[60px] w-full resize-none bg-transparent pl-4 pr-16 py-[1.3rem] focus-within:outline-none sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  rows={1}
                  {...form.register("message")}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={form.watch("message") === ""}
                  >
                    <ArrowDownIcon className="w-5 h-5" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
