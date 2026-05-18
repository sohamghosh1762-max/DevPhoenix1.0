import React, { ReactNode } from "react";
import { 
  Component, 
  Send, 
  CheckCircle, 
  Repeat, 
  Download,
  TerminalSquare,
  Network,
  Rocket
} from "lucide-react";
import { cn } from "./ShineBorder";

export function TimelineContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center gap-4">
      {children}
    </div>
  );
}

const lucideMap: Record<string, any> = {
  Component,
  Send,
  CheckCircle,
  Repeat,
  Download,
  TerminalSquare,
  Network,
  Rocket
};

export function TimelineEvent({
  label,
  message,
  icon,
  isLast = false,
}: Event & {
  isLast?: boolean;
}) {
  const Icon = lucideMap[icon.name] || Component;
  return (
    <div className="group relative -m-2 flex gap-4 border border-transparent p-2">
      <div className="relative">
        <div
          className={cn(
            "rounded-full border bg-white p-2.5 z-10 relative shadow-sm transition-transform duration-300 group-hover:scale-110",
            icon.borderColor
          )}
        >
          <Icon className={cn("h-4 w-4", icon.textColor)} />
        </div>
        {!isLast ? (
          <div className="absolute inset-x-0 mx-auto h-full w-[2px] bg-slate-100 group-hover:bg-orange-100 transition-colors duration-300" />
        ) : null}
      </div>
      <div className="mt-1 flex flex-1 flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{label}</p>
        </div>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export function Timeline({ events = defaultTimeline }: { events?: Event[] }) {
  return (
    <div className="w-full">
      <TimelineContainer>
        {events.map((event, i) => (
          <TimelineEvent
            key={event.message}
            isLast={i === events.length - 1}
            {...event}
          />
        ))}
      </TimelineContainer>
    </div>
  );
}

export interface Event {
  label: string;
  message: string;
  icon: {
    name: string;
    textColor: string;
    borderColor: string;
  };
}

export const defaultTimeline = [
  {
    label: "Choose Your Design",
    message: "Browse and select a design that fits your needs.",
    icon: {
      name: "Component",
      textColor: "text-orange-500",
      borderColor: "border-orange-500/40 bg-orange-50",
    },
  },
] satisfies Event[];
